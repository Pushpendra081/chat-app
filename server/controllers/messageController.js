import Message from "../models/Message";


// Get all users except the logged in user
export const gerUsersForSidebar = async (req, res)=>{
    try {
        const userId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: userId}}).select("-password");

        // Count number of messages not seen
        const unseenMessages = {}
            const promises = filteredUsers.map(async (user)=>{
                const message = await Message.find({senderId: user._id, receiverId: userId, seen: false})
                if(message.length > 0){
                    unseenMessages[user._id] = unseenMessages.length;
                }
            })
        await Promis.all(promises);
        res.json({success: true, users: filteredUsers, unseenMessages})
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}

// Get all messages for selected user
export const gerMessages = async (req, res) =>{
    try {
        const { id: selectedUserId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                {senderId: myId, receiverId: selectedUserId},
                {senderId: selectedUserId, receiverId: myId},
            ]
        })
        await Message.updateMany({senderId: selectedUserId, receiverId: myId},{seen: true});

        res.json({success: true, message})
        
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}