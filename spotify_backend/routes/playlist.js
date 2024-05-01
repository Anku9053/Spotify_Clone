const express = require("express");
const  passport = require("passport");
const Playlist = require("../models/Playlist");
const Song = require("../models/Song");
const  router = express.Router();
const  User = require("../models/Users");
router.post("/create",passport.authenticate("jwt",{session:false}),async(req,res)=>{
    const currentUser = req.user;
    const {name,thumbnail,songs}= req.body;
    if(!name || !thumbnail || !songs){
        return res.status(301).json({err:"Insufficient details  to create a playlist"})
    }
    const  playListData = {
        name,thumbnail,songs,owner:currentUser._id,collaborators:[],
    };
    const playList = await Playlist.create(playListData);
    return res.status(200).json(playList);
})


router.get("/get/playlist/:plalistId",passport.authenticate("jwt",{session:false}),async(req,res)=>{
    const playlistId = req.params.plalistId;
    const playList = await Playlist.findOne({_id:playlistId})
    if(!playList){
        return res.status(301).json({err:"Playlist does not exist"})
    }
    return res.status(200).json(playList);
})


router.get("/get/artist/:artistId",passport.authenticate("jwt",{session:false}),async(req,res)=>{
    const artistId = req.params.artistId;
    const artist = await User.findOne({_id:artistId});
    if(!artist){
        return res.status(301).json({err:"Artist does not exist"});
    }
    const  playLists = await Playlist.find({owner:artistId});
    return res.status(200).json({data:playLists});
})


router.post("/add/song",passport.authenticate("jwt",{session:false}),async(req,res)=>{
    const  currentUser = req.user;
    const {playlistId,songId} = req.body;

    const playList = await Playlist.findOne({_id:playlistId});
    if(!playList){
        return res.status(304).json({err:"Playlist does not exist"});
    }

    if(!playList.owner.equals(currentUser._id) && !Playlist.collaborators.includes(currentUser._id)){
        return res.status(400).json({err:"Plesae Login to  add a Song"})
    }
    const  song = await Song.findOne({_id:songId});
    if(!song){
        return res.status(304).json({err:"Song does not exist"});
    }

    playList.songs.push(songId);
    await playList.save();
    return res.status(200).json(playList);
})
module.exports = router;