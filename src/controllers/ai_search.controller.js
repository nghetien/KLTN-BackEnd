const { AISearch, Tag, Post, PostTag } = require("../models");
const PostController = require("./post.controller");

const createTag = async (content) => {
    const findTag = await Tag.findOne({ content: { $regex: content, $options: "i" } }).exec();
    if (findTag) {
        return findTag;
    } else {
        const newTag = new Tag({
            content,
            status: true,
        });
        const createTag = await newTag.save();
        return createTag;
    }
}

class AISearchController {
    async addTagToGroup(req, res) {
        try {
            const { contentSearch, listTags } = req.body;
            const newTag = await createTag(contentSearch);
            let key = `group.${newTag._id.toString()}`;
            const checkExists = { $exists: true };
            let query = {}
            for (const tag of listTags) {
                key = `group.${tag}`;
                query[key] = checkExists;
            }
            const searchGroup = await AISearch.findOne(query).exec();
            if (searchGroup) {
                const newGroup = {
                    ...searchGroup.group
                };
                if (newGroup[newTag._id.toString()] === undefined) {
                    newGroup[newTag._id.toString()] = 1;
                } else {
                    newGroup[newTag._id.toString()] += 1;
                }
                for (const tag of listTags) {
                    if (newGroup[tag] === undefined) {
                        newGroup[tag] = 1;
                    } else {
                        newGroup[tag] += 1;
                    }
                }
                searchGroup.group = newGroup;
                await searchGroup.save();
                res.status(200).json({
                    status: true,
                    message: 'OKE',
                    data: searchGroup,
                });
            } else {
                key = newTag._id.toString();
                const dataTags = {
                    [key]: 1,
                }
                for (const tag of listTags) {
                    key = tag;
                    dataTags[key] = 1
                }
                const newGroup = new AISearch({
                    group: dataTags,
                });
                await newGroup.save();
                res.status(200).json({
                    status: true,
                    message: 'OKE',
                    data: newGroup,
                });
            }
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.toString(),
                data: null,
            });
        }
    }

    async searchAllTag(req, res) {
        try {
            const { searchValue } = req.body;
            let dataResponse = [];
            const lowSearch = searchValue.toLowerCase().trim();
            const allPost = await Post.find().exec();
            dataResponse = await PostController.dataResponseFromList(allPost);
            let dataFilter = [];
            for (const item of dataResponse) {
                dataFilter.push({
                    _id: item._id.toString(),
                    email: item.email,
                    namePost: item.namePost,
                    shortContent: item.shortContent,
                    typeContent: item.typeContent,
                    tags: item.tags.map(tag => tag.content),
                })
            };
            dataFilter = dataFilter.filter(post => {
                return Object.values(post).some(val => {
                    if (typeof (val) === 'string') {
                        return String(val).toLowerCase().includes(lowSearch)
                    } else if (Array.isArray(val)) {
                        return val.some(valTag => String(valTag).toLowerCase().includes(lowSearch))
                    }
                })
            });
            dataFilter = dataFilter.map(item => item._id);
            dataResponse = dataResponse.filter(item => dataFilter.includes(item._id.toString()));
            const newTag = await createTag(searchValue);
            let key = `group.${newTag._id.toString()}`;
            const searchGroup = await AISearch.find({
                [key]: { $exists: true },
            }).exec();
            const mapKeyInGroup = {};
            searchGroup.forEach(item => {
                const listObjectKey = Object.keys(item.group);
                for (const tag of listObjectKey) {
                    if (mapKeyInGroup[tag] === undefined) {
                        mapKeyInGroup[tag] = item.group[tag];
                    } else {
                        mapKeyInGroup[tag] += item.group[tag];
                    }
                }
            })
            let listKeyInGroup = [];
            for (var item in mapKeyInGroup) {
                listKeyInGroup.push([item, mapKeyInGroup[item]]);
            }
            listKeyInGroup.sort(function (a, b) {
                return b[1] - a[1];
            });
            console.log(listKeyInGroup);
            for (const tagAndValue of listKeyInGroup) {
                const tag = tagAndValue[0];
                const findPostTagByIDTag = await PostTag.find({ idTag: tag }).exec();
                let listPostTag = [];
                if (findPostTagByIDTag) {
                    for (const post of findPostTagByIDTag) {
                        const findPost = await Post.findById(post.idPost).exec();
                        listPostTag.push(findPost);
                    }
                }
                const listIdDataResponse = dataResponse.map(item => item._id.toString());
                listPostTag = await PostController.dataResponseFromList(listPostTag);
                listPostTag.forEach(item => {
                    if (!listIdDataResponse.includes(item._id.toString())) {
                        dataResponse.push(item);
                    }
                })
            }
            res.status(200).json({
                status: true,
                message: 'OKE',
                data: dataResponse,
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.toString(),
                data: null,
            });
        }
    }
}

module.exports = new AISearchController();