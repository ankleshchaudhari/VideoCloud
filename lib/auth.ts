import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {connectionToDatabase} from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
//import GithubProvider from "next-auth/providers/github";

export const authOptions:NextAuthOptions={
    
    /* Just BluePrint of how nextauth allow us to loggedin via our excternal providars(git , google...)
    providers: [
        GithubProvider({
          clientId: process.env.GITHUB_ID,
          clientSecret: process.env.GITHUB_SECRET,
        }),
        // ...add more providers here
      ],
      */

      providers:[
      CredentialsProvider({
             name: "Credentials",
             credentials:{
                email: {label:"Email", type:"text"},
                password: {label:"Password", type:"password"}
             },

             async authorize(credentials)
             {
                   if(!credentials?.email || !credentials.password)
                   {
                     throw new Error("Missing Email or Password");
                   }

                   try{
                      await connectionToDatabase()
                      const user=  await User.findOne({email:credentials.email})

                      if(!user)
                      {
                        throw new Error("No User found with this");
                      }

                      const isValid= await bcrypt.compare(
                        credentials.password,
                        user.password
                      )

                      if(!isValid)
                      {
                        throw new Error("Invalid Password");
                      }

                      return{
                        id: user._id.toString(),
                        email: user.email
                      }
                   }
                   catch(error)
                   {
                    console.error("Auth Error", error);
                    throw error
                   }
             }
      })
    ],

    callbacks:{
      async jwt({token,user})
      {
         if(user)
         {
           token.id=user.id;
         }

         return token;
      },

      async session({session,token})
      {
         if(session.user)
         {
           session.user.id=token.id as string;
         }

         return session;
      }
    },

    pages:{
      signIn: "/login",
      error:"/logon",
    },
    session:{
      strategy:"jwt",
      maxAge:30*24*60*60,
    },
    secret: process.env.NEXTAUTH_SECRET,
};