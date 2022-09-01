const sequelize = require('../config/connection');
const { Model, DataTypes } = require('sequelize');

class Post extends Model {
    static upvote(body, models) {
        return models.Vote.create({
        user_id: body.user_id,
        post_id: body.post_id
        }).then(() => {
        return Post.findOne({
            where: {
            id: body.post_id
            },
            attributes: [
            'id',
            'username',
            'title',
            'created_at',
            [
                sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
                'vote_count'
            ]
            ]
        });
        });
    }
}

Post.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'post'
    }
);

module.exports = Post;