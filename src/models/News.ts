import mongoose, { Schema, model, models } from 'mongoose'

const NewsSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    excerpt: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    authorId: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ['Teknologi', 'Tips', 'Berita', 'Update', 'Tutorial'],
        required: true,
    },
    featuredImage: {
        type: String, // Base64 string or URL
    },
    published: {
        type: Boolean,
        default: false,
    },
    views: {
        type: Number,
        default: 0,
    },
    tags: {
        type: [String],
        default: [],
    },
}, {
    timestamps: true,
})

// Ensure virtuals are included in toJSON output
NewsSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret: any) {
        delete ret._id
        return ret
    }
})

const News = models.News || model('News', NewsSchema)

export default News
