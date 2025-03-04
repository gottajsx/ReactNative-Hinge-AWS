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

app.get('/matches', (req, res) => {
    try {
        console.log('GET /matches api endpoint');
    } catch (error) {
        console.log('Error ', error);
    }
});

app.get('/user_info', (req, res) => {
    try {
        console.log('GET /user_info api endpoint');
    } catch (error) {
        console.log('Error ', error);
    }
});

const authenticateToken = (req, res, next) => {
    console.log('authenticateToKen function')
}

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


