import { getUploadAuthParams } from "@imagekit/next/server" // Import function to generate ImageKit upload auth parameters

export async function GET() {

    try
    {
            const authenticationParameters = getUploadAuthParams({
                privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string, //Private key never goes to frontend — it stays hidden and is used only to generate the signature/token.
                publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,   //Needed to upload files

            })

            // Send auth details + public key back to frontend
            return Response.json({ authenticationParameters, publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY })
    }
    catch(error)
    {
        return Response.json(
            {
                error:"Authentication for Imagekit failed",
            },
            {status:500}
        );
    }

}