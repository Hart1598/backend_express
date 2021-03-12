

class infoController{
    async getInfo(req, res){
        try{
            const id = req.userInfo.body.id
            if(id){
                res.status(200).json({id})
            }
            else{
                res.status(400).json({message: 'No find ID'})
            }
        }
        catch (e) {
            console.log(e)
            res.status(400).json({message: e})
        }
    }
}

export default new infoController()