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

app.post('/register', (req, res) => {
    try {
        console.log('POST /register api endpoint');
    } catch (error) {
        console.log('Error ', error);
    }
});

app.post('/sendOtp', (req, res) => {
    try {
        console.log('POST /sendOtp api endpoint');
    } catch (error) {
        console.log('Error ', error);
    }
});

app.post('/resendOtp', (req, res) => {
    try {
        console.log('POST /resendOtp api endpoint');
    } catch (error) {
        console.log('Error ', error);
    }
});

app.post('/confirmSignup', (req, res) => {
    try {
        console.log('POST /confirmSignup api endpoint');
    } catch (error) {
        console.log('Error ', error);
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


