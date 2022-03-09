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
            let listTags = [];
            console.log(searchGroup);
            searchGroup.sort((pre1, pre2) => {
                const listKey1 = Object.keys(pre1.group).sort((a, b) => pre1.group[b] - pre1.group[a]);
                const listKey2 = Object.keys(pre2.group).sort((a, b) => pre2.group[b] - pre2.group[a]);
                console.log(listKey1)
                console.log(listKey2)
                if(pre1.group[listKey1[0]] > pre2.group[listKey2[0]]){
                    return 1;
                }
                return -1;
            });
            console.log(searchGroup);
            for (const group of searchGroup) {
                const listKeyInGroup = Object.keys(group.group)
                    .sort((a, b) => group.group[b] - group.group[a]);
                for (const keyTag of listKeyInGroup) {
                    let listPostTag = [];
                    if (!listTags.includes(keyTag)) {
                        listTags.push(keyTag);
                        const findPostTagByIDTag = await PostTag.find({ idTag: keyTag }).exec();
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
                                dataResponse.unshift(item);
                            }
                        })
                    }
                }
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