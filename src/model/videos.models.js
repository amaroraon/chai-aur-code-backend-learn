import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
  {
    videoFile: {
      type: String, //Cloudinary file String
      require: [true, "Video file is required"],
    },
    title: {
      type: String,
      require: [true, "Title is required"],
    },

    thumbnail: {
      type: String, //Cloudinary file String
      require: [true, "Thumbnail is required"],
    },
    description: {
      type: String,
      require: [true, "Description is required"],
    },

    duration: {
      type: Number,
    },
    views: {
      type: Number,
      default: 0,
    },
    videoOwner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

//aggregate Queries
videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);
