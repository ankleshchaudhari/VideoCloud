import mongoose , {Schema , model , models} from "mongoose";

// Fixed video size values (we will use these as default values)
export const VIDEO_DIMENSIONS={
    width: 1080,
    height: 1920
} as const;

// This tells TypeScript what a Video object looks like
export interface IVideo
{
    _id?: mongoose.Types.ObjectId
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl:string;
    controls?:boolean;
    transformation?:{
        height: number;
        width:number;
        quality?:number;
    };
}

// Creating a schema = structure of how Video will be saved in MongoDB
const videoSchema=new Schema<IVideo>
(
    {
        title:{type:String, required: true},
        description:{type:String, required: true},
        videoUrl:{type:String, required: true},
        thumbnailUrl:{type:String, required: true},
        controls:{type:Boolean, default: false},
        transformation:{
            height:{type:Number, default: VIDEO_DIMENSIONS.height},
            width:{type:Number, default: VIDEO_DIMENSIONS.width},
            quality:{type:Number, min:1, max:100},
        }
    },
    {
        timestamps: true
    }
)

// Prevent model re-creation error in Next.js (Hot Reload)
// If model exists, use it. Otherwise create new.
const Video=models?.Video || model<IVideo>("Video", videoSchema);

export default Video;