import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dayjs from 'dayjs';
import {
    DynamoDBClient,
    PutItemCommand,
    QueryCommand,
    ScanCommand,
    UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';
import crypto from 'crypto';
import {
    CognitoIdentityProviderClient,
    ConfirmSignUpCommand,
    InitiateAuthCommand,
    ResendConfirmationCodeCommand,
    SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { docClient, PutCommand } from './db.js';
import {
    BatchGetCommand,
    GetCommand,
    UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { profile } from 'console';
import http from 'http';
import { Server, Socket} from 'socket.io';

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(express.json());

const PORT = 9000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})

const dynamoDBClient = new DynamoDBClient({region: 'us-east-2'});

const cognitoClient = new CognitoIdentityProviderClient({region: 'us-east-2'});

const server = http.createServer(app);

app.post('/register', async (req, res) => {
    try {
        const userData = req.body;
        console.log('Data', userData);

        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const userId = crypto.randomUUID();

        const newUser = {
            userId,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            password: hashedPassword,
            gender: userData.gender,
            dateOfBirth: userData.dateOfBirth,
            type: userData.type,
            location: userData.location,
            hometown: userData.hometown,
            workPlace: userData.workPlace,
            jobTitle: userData.jobTitle,
            datingPreferences: userData.datingPreferences || [],
            lookingFor: userData.lookingFor,
            imageUrls: userData.imageUrls,
            prompts: userData.prompts,
            likes: 2,
            roses: 1,
            likedProfiles: [],
            receivedLikes: [],
            matches: [],
            blockedUsers: [],
        };

        const params = {
            TableName: 'usercollection',
            Item: newUser,
        };

        await docClient.send(new PutCommand(params));

        const secretKey =
            '582e6b12ec6da3125121e9be07d00f63495ace020ec9079c30abeebd329986c5c35548b068ddb4b187391a5490c880137c1528c76ce2feacc5ad781a742e2de0'; // Use a better key management
        const token = jwt.sign({userId: newUser.userId}, secretKey);

        res.status(200).json({token})
    } catch (error) {
        console.log('Error creating user', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

app.post('/sendOtp', async (req, res) => {
    const {email, password} = req.body;
    console.log('email', email);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({error: 'Invalid email format.'});
    }

    const signUpParams = {
        ClientId: '',
        Username: email,
        Password: password,
        UserAttributes: [{Name: 'email', Value: email}],
    }

    try {
        const command = new SignUpCommand(signUpParams);
        await cognitoClient.send(command);

        res.status(200).json({message: 'OTP sent to email!'});
    } catch (error) {
        console.error('Error sending OTP:', error)
        res.status(400).json({error: 'Failed to send OTP. Please try again.'});
    }
});

app.post('/resendOtp', async (req, res) => {
    const {email} = req.body;

    const resendParams = {
        ClientId: '',
        Username: email,
    };

    try {
        const command = new ResendConfirmationCodeCommand(resendParams);
        await cognitoClient.send(command);

        res.status(200).json({message: 'New otp sent to mail'});
    } catch (error) {
        console.log('Error', error);
    }
});

app.post('/confirmSignup', async (req, res) => {
    const {email, otpCode} = req.body;

    const confirmParams = {
        ClientId: '',
        Username: email,
        ConfirmationCode: otpCode,
    }
    try {
        const command = new ConfirmSignUpCommand(confirmParams);
        await cognitoClient.send(command);

        res.status(200).json({message: 'Email verified successfully!'});
    } catch (error) {
        console.log('Error confirming Sign Up', error);
    }
});

app.get('/matches', async (req, res) => {
    const {userId} = req.query

    // console.log('user', userId);

    try {
        if (!userId) {
            return res.status(400).json({message: 'UserId is required'});
        }

        const userParams = {
            TableName: 'users',
            Key: {userId},
        }

        const userResult = await dynamoDbClient.send(new GetCommand(userParams));

        if (!userResult.Item) {
            return res.status(404).json({message: 'User not found'});
        }

        const user = {
            userId: userResult.Item.userId,
            gender: userResult.Item.gender,
            datingPreferences:
                userResult.Item.datingPreferences?.map(pref => pref) || [],
            matches: userResult.Item.matches?.map(match => match) || [],
            likedProfiles:
                userResult?.Item.likedProfiles?.map(lp => lp.likedUserId) || [],
        };

        const genderFilter = user?.datingPreferences?.map(g => ({S: g}));
        const excludeIds = [
            ...user.matches,
            ...user.likedProfiles,
            user.userId,
        ].map(id => ({S: id}));

        const scanParams = {
            TableName: 'users',
            FilterExpression:
                'userId <> :currentUserId AND (contains(:genderPref,gender)) AND NOT contains(:excludedIds,userId)',
                ExpressionAttributeValues: {
                    ':currentUserId': {S: user.userId},
                    ':genderPref': {
                        L: genderFilter.length > 0 ? genderFilter : [{S: 'None'}],
                    },
                    ':excludedIds': {L: excludeIds},
                },    
        };

        const scanResult = await dynamoDbClient.send(new ScanCommand(scanParams));


        const matches = scanResult.Items.map(item => ({
            userId: item?.userId.S,
            email: item?.email.S,
            firstName: item?.firstName.S,
            gender: item?.gender.S,
            location: item?.location.S,
            lookingFor: item?.lookingFor.S,
            dateOfBirth: item.dateOfBirth.S,
            hometown: item.hometown.S,
            type: item.type.S,
            jobTitle: item.jobTitle.S,
            workPlace: item.workPlace.S,
            imageUrls: item.imageUrls?.L.map(url => url.S) || [],
            prompts:
                item?.prompts.L.map(prompt => ({
                    question: prompt.M.question.S,
                    answer: prompt.M.answer.S,
                })) || [],
        }));

        res.status(200).json({matches});
    } catch (error) {
        console.log('Error fetching matches', error);
        res.status(500).json({message: 'Internal server error'});
    }
});

app.get('/user_info', async (req, res) => {
    const {userId} = req.query;

    console.log('User ID', userId);

    if (!userId) {
        return res.status(400).json({message: 'User id is required'});
    }

    try {
        const params = {
            TableName: 'users',
            Key: {userId},
        };
        const command = new GetCommand(params);
        const result = await dynamoDbClient.send(command);

        if (!result.Item) {
            return res.status(404).json({message: 'User not found'});
        }

        console.log('res', result);

        res.status(200).json({user: result.Item});
    } catch (error) {
        console.log('Error fetching user details', error);
        res.status(500).json({message: 'Internal server error'});
    }
});

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(404).json({message: 'Token is required'});
    }

    const token = authHeader.split(' ')[1];
    console.log('recieived token', token);

    const secretKey =
        '582e6b12ec6da3125121e9be07d00f63495ace020ec9079c30abeebd329986c5c35548b068ddb4b187391a5490c880137c1528c76ce2feacc5ad781a742e2de0'; // Use a better key management

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({message: 'Invalid or expired token'});
        }

        req.user = user;
        next();
    });   
};
    

app.get('/like_profile', authenticateToken, (req, res) => {
    try {
        console.log('GET /like_profile api endpoint');
    } catch (error) {
        console.log('Error ', error);
    }
});

app.get('/received-likes/:userId', authenticateToken, (req, res) => {
    try {
        console.log('GET /received-likes/:userId api endpoint');
    } catch (error) {
        console.log('Error ', error);
    }
});

app.post('/login', (req, res) => {
    try {
        console.log('POST /login api endpoint');
    } catch (error) {
        console.log('Error ', error);
    }
});

function getIndexToRemove(selectedUserId, currentUserId) {
    console.log('getIndexToRemove api function')
}

app.get('/get-matches/:userId', authenticateToken, (req, res) => {
    try {
        console.log('GET /get-matches api endpoint');
    } catch (error) {
        console.log('Error ', error);
    }
});


