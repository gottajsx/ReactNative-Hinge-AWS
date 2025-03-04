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

app.post('/like-profile', authenticateToken, async (req, res) => {
    const {userId, likedUserId, image, comment = null, type, prompt} = req.body;
  
    if (req.user.userId !== userId) {
        return res.status(403).json({message: 'unauthorized action'});
    }
    if (!userId || !likedUserId) {
        return res.status(404).json({message: 'Missing required parametered'});
    }
  
    try {
        const userParams = {
            TableName: 'users',
            Key: {userId},
        };
  
        const userData = await dynamoDbClient.send(new GetCommand(userParams));
  
        if (!userData.Item) {
            return res.status(404).json({message: 'User not found'});
        }
  
        const user = userData.Item;
        const likesRemaining = user.likes;
        console.log('likes remaining', likesRemaining);
        const likesLastUpdated = new Date(user?.likesLastUpdated?.S || '0');
        console.log('Likes last updated', likesLastUpdated);
        const now = new Date();
        const maxLikes = 2;
        const oneDay = 24 * 60 * 60 * 1000;
  
        const timeSinceLastUpdate = now - likesLastUpdated;
  
        if (timeSinceLastUpdate >= oneDay) {
            const resetParams = {
                TableName: 'users',
                Key: {userId},
                UpdateExpression: 'SET likes = :maxLikes, likesLastUpdated = :now',
                ExpressionAttributeValues: {
                    ':maxLikes': {N: maxLikes.toString()},
                    ':now': {S: now.toISOString()},
                },
            };
            await dynamoDbClient.send(new UpdateCommand(resetParams));
  
            user.likes = {N: maxLikes.toString()};
        } else if (likesRemaining <= 0) {
            return res.status(403).json({
                message:
                    'Daily like limit reached, please subscribe or try again tomorrow',
            });
        }
  
        const newLikes = likesRemaining - 1;
  
        const decrementLikesParams = {
            TableName: 'users',
            Key: {userId},
            UpdateExpression: 'SET likes = :newLikes',
            ExpressionAttributeValues: {
                ':newLikes': newLikes,
            },
        };
  
        await dynamoDbClient.send(new UpdateCommand(decrementLikesParams));
  
        let newLike = {userId, type};
  
        if (type == 'image') {
            if (!image) {
                return res.status(404).json({message: 'Image url is required'});
            }
            newLike.image = image;
        } else if (type == 'prompt') {
            if (!prompt || !prompt.question || !prompt.answer) {
                return res.status(400).json({message: 'Prompts are required'});
            }
            newLike.prompt = prompt;
        }
  
        if (comment) {
            newLike.comment = comment;
        }
  
        //step 1
        const updatedReceivedLikesParams = {
            TableName: 'users',
            Key: {userId: likedUserId},
            UpdateExpression:
                'SET receivedLikes = list_append(if_not_exists(receivedLikes, :empty_list), :newLike)',
            ExpressionAttributeValues: {
                ':newLike': [newLike],
                ':empty_list': [],
            },
            ReturnValues: 'UPDATED_NEW',
        };
  
        await dynamoDbClient.send(new UpdateCommand(updatedReceivedLikesParams));
  
        //step 2
  
        const updatedLikedParams = {
            TableName: 'users',
            Key: {userId},
            UpdateExpression:
                'SET likedProfiles = list_append(if_not_exists(likedProfiles, :empty_list), :likedUserId)',
            ExpressionAttributeValues: {
                ':likedUserId': [{likedUserId}],
                ':empty_list': [],
            },
            ReturnValues: 'UPDATED_NEW',
        };
  
        await dynamoDbClient.send(new UpdateCommand(updatedLikedParams));
  
        res.status(200).json({message: 'Profile Likes succesfully!'});
    } catch (error) {
        console.log('Error liking', error);
        res.status(500).json({message: 'Internal server error'});
    }
  });

app.get('/received-likes/:userId', authenticateToken, async (req, res) => {
    const {userId} = req.params;
  
    console.log('User', userId);
  
    try {
        const params = {
            TableName: 'users',
            Key: {userId: userId},
            ProjectionExpression: 'receivedLikes',
        };
  
        const data = await dynamoDbClient.send(new GetCommand(params));
        console.log('User', data);
  
        if (!data.Item) {
            return res.status(404).json({message: 'User not found'});
        }
  
        const receivedLikes = data?.Item?.receivedLikes || [];
  
        const enrichedLikes = await Promise.all(
            receivedLikes.map(async like => {
                const userParams = {
                    TableName: 'users',
                    Key: {userId: like.userId},
                    ProjectionExpression: 'userId, firstName, imageUrls, prompts',
                };
  
                const userData = await dynamoDbClient.send(new GetCommand(userParams));
                console.log('User data', userData);
  
                const user = userData?.Item
                    ? {
                        userId: userData.Item.userId,
                        firstName: userData.Item.firstName,
                        imageUrls: userData.Item.imageUrls || null,
                        prompts: userData.Item.prompts,
                    }
                    : {userId: like.userId, firstName: null, imageUrl: null};
  
                return {...like, userId: user};
            }),
        
        );
  
        console.log('Encriches', enrichedLikes);
  
        res.status(200).json({receivedLikes: enrichedLikes});
        } catch (error) {
            console.log('Error getting the likes');
            res.status(500).json({message: 'Internal server error'});
        }
});

app.post('/login', async (req, res) => {
    const {email, password} = req.body;
  
    console.log('Email', email);
    console.log('password', password);
  
    const authParams = {
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: '',
        AuthParameters: {
            USERNAME: email,
            PASSWORD: password,
        },
    };
  
    try {
        const authCommand = new InitiateAuthCommand(authParams);
        const authResult = await cognitoClient.send(authCommand);
  
        const {IdToken, AccessToken, RefreshToken} =
            authResult.AuthenticationResult;
  
        const userParams = {
            TableName: 'users',
            IndexName: 'email-index',
            KeyConditionExpression: 'email = :emailValue',
            ExpressionAttributeValues: {
                ':emailValue': {S: email},
            },
        };
  
        const userResult = await dynamoDbClient.send(new QueryCommand(userParams));
  
        if (!userResult.Items || userResult.Items.length == 0) {
            return res.status(404).json({error: 'User not found'});
        }
  
        const user = userResult.Items[0];
        const userId = user?.userId.S;
  
        const secretKey =
            '582e6b12ec6da3125121e9be07d00f63495ace020ec9079c30abeebd329986c5c35548b068ddb4b187391a5490c880137c1528c76ce2feacc5ad781a742e2de0'; // Use a better key management
  
        const token = jwt.sign({userId: userId, email: email}, secretKey);
  
        res.status(200).json({token, IdToken, AccessToken});
    } catch (error) {
        console.log('Error', error);
        return res.status(500).json({message: 'Interval server error'});
    }
});

async function getIndexToRemove(selectedUserId, currentUserId) {
    const result = await docClient.send(
        new GetCommand({
            TableName: 'users',
            Key: {userId: selectedUserId},
            ProjectionExpression: 'likedProfiles',
        }),
    );
  
    const likedProfiles = result?.Item?.likedProfiles || [];
    return likedProfiles?.findIndex(
        profile => profile.likedUserId == currentUserId,
    );
  }

app.get('/get-matches/:userId', authenticateToken, (req, res) => {
    try {
        console.log('GET /get-matches api endpoint');
    } catch (error) {
        console.log('Error ', error);
    }
});


