const express = require("express");
const passport = require("passport");
const Song = require("../models/Song");
const User = require("../models/Users");
const { findMatches } = require("../utils/fuzzySearch");
const router = express.Router();

// Create a song
router.post("/create", passport.authenticate("jwt", { session: false }), async (req, res) => {
    console.log(req.user); // Check if user is authenticated
    const { name, thumbnail, track } = req.body;
    if (!name || !thumbnail || !track) {
        return res.status(301).json({ error: "Insufficient details to create song." });
    }

    const artist = req.user._id;
    const songDetail = { name, thumbnail, track, artist };
    const createdSong = await Song.create(songDetail);
    return res.status(200).json(createdSong);
});

// Get songs created by the current user
router.get("/get/mysongs", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const currentUser = req.user;
    const songs = await Song.find({ artist: currentUser._id });
    return res.status(200).json({data:songs});
});


router.get("/get/artist/:artistID",passport.authenticate("jwt",{session:false}), async(req,res)=>{
    const {artistID} = req.params;

    const  artist = await User.findOne({_id:artistID});
    if(!artist){
        return res.status(301).json({err:"Artist does not exist"})
    }
    const  songs = await Song.find({artist:artistID});
    return res.status(200).json({data:songs});
})


// router.get("get/name",passport.authenticate("jwt",{session:false}),async(req,res)=>{
//     const {songName} = req.body;
//     const  songs = await Song.find({name:songName});
//     return res.status(200).json({data:songs});
// })


router.get("/get/songname/:songName", passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const { songName } = req.params; // Use query parameter instead of body
        const songs = await Song.find(); // Fetch all songs

        // Use fuzzy search to find matches
        const matchedSongs = findMatches(songs, songName);

        return res.status(200).json({ data: matchedSongs });
    } catch (error) {
        console.error("Error searching for songs:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
module.exports = router;
