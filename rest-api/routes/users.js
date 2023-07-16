const User = require("../models/User");
const bcrypt = require("bcrypt");
const router = require("express").Router();

//update user
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json("Account has been updated.");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can update only your account.");
  }
});

//delete user
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account has been deleted.");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can delete only your account.");
  }
});

//get user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get user's friends
router.get("/friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const followingFriends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId);
      })
    );
    const followersFriends = await Promise.all(
      user.followers.map((friendId) => {
        return User.findById(friendId);
      })
    );

    const friends = followingFriends.concat(...followersFriends);

    const filterFriends = friends.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.id === value.id)
    );

    // res.json(filterFriends);

    let friendList = [];

    filterFriends.map((friend) => {
      const { _id, username, profilePic } = friend;
      friendList.push({ _id, username, profilePic });
    });
    res.status(200).json(friendList);
  } catch (err) {
    res.status(500).json(err);
  }
});

//follow a user
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      if (!user.followers.includes(currentUser._id)) {
        await user.updateOne({
          $push: { followers: currentUser._id },
        });
        await currentUser.updateOne({
          $push: { followings: user._id },
        });

        res.status(200).json("User has been followed");
      } else {
        res.status(403).json("You already follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can't follow yourself");
  }
});

//unfollow a user
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      if (user.followers.includes(currentUser._id)) {
        await user.updateOne({
          $pull: { followers: currentUser._id },
        });
        await currentUser.updateOne({
          $pull: { followings: user._id },
        });

        res.status(200).json("User has been unfollowed");
      } else {
        res.status(403).json("You already unfollow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can't unfollow yourself");
  }
});

module.exports = router;
