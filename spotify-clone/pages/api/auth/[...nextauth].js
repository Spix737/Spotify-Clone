import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify"

async function refreshAccessToken(token){
    try{
        spotifyApi.setAccessToken(token.accessToken); 
        spotifyApi.setRefreshToken(token.refreshToken);
        const { body: refreshedToken } = await spotifyApi.refreshAccessToken();
        console.log("Refreshed access token: ", refreshedToken);
        return {
            ...token,
            accessToken: refreshedToken.access_token, 
            refreshToken: refreshedToken.refresh_token ?? token.refreshToken,  
            accessTokenExpires: Date.now + refreshedToken.expires_in * 1000, //spotify api returns 1h in seconds: 3600.
        }

    } catch(error){
        console.error(error)
    
        return {
            ...token,
            error: 'RefreshAccessTokenError'
        };
    } 
}

export default NextAuth({
    // Configure one or more authentication providers  
    providers: [    
        SpotifyProvider({      
            clientId: process.env.NEXT_PUBLIC_CLIENT_ID,      
            clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,  
            authorization: LOGIN_URL    
        }),
        // ...add more providers here  
    ],
    secret: process.env.JWT_SECRET,
    pages:  {
        login: "/login",
    },
    callbacks: {
        async jwt({ token, account, user }) {
            //initial user sign in
            if (account && user){
                return{
                    ...token,
                    accessToken: account.access_Token,
                    refreshToken: account.refresh_token,
                    username: account.providerAccountId,
                    accessTokenExpires: account.expires_at * 1000, //handle expiry time in ms
                 }; 
            }
            //return the previous token if current token is expired
            if(Date.now() <  token.accessTokenExpires){
                console.log("Existing token is valid");
                return token;
             }
            
            //refresh token
            console.log("Existing token has expired");
            return await refreshAccessToken(token);
        },

        async session({session, token}){
            session.user.accessToken = token.accessToken;
            session.user.refreshToken = token.refreshToken;
            session.user.username = token.username;
            return session;
        }
    }
 });