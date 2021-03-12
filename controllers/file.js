import FileService from '../services/file.js'

class fileController{
    async uploadFile(req, res){
        try{
            FileService.upload(req.files.file, (err) =>  {
                if(err){
                    res.status(500).json({message: 'Failed to save on db'})
                }else{
                    res.json({message: 'OK'})
                }
            })
        }
        catch (e) {
            res.status(500).json({message: e})
        }
    }

    async getFileInfo(req, res) {
        try{
            const {id} = req.params
            if(!id){
                res.json({message:'No find id in query'})
            }

            FileService.getFileInfoById(id, (err, info) => {
                if(!err){
                    res.status(400).json({message: 'Failed to find user ' + info})
                    return
                }
                if(info){
                    res.status(200).json(info)
                }
                else{
                    res.status(404).json({message: 'No find'})
                }
            })
        }
        catch (e){
            console.log(e)
            res.status(500).json({message: e})
        }
    }

    async deleteFile(req, res){
        try{
            const {id} = req.params
            if(!id){
                res.json({message:'No find id in query'})
            }
            FileService.deleteFileById(id, (err) => {
                if(!err){
                    res.status(400).json({message: 'Failed to find file in table '})
                    return
                }
                else{
                    res.status(200).json({message: 'File deleted'})
                }
            })
        }
        catch (e) {
            res.status(500).json({message: e})
        }
    }


    async downloadFile(req, res){
        try{
            const {id} = req.params
            FileService.downloadFileByID(id, (err, info) => {
                if(!err){
                    res.status(400).json({message: 'Failed to find file ' + info})
                    return
                }
                if(info){
                    res.download(info)
                }
                else{
                    res.status(404).json({message: 'No find'})
                }
            })
        }
        catch (e) {
            console.log(e)
            res.status(500).json({message: e})
        }
    }

    async updateFile(req, res){
        try{
            const {id} = req.params
            if(req.files !== undefined){
                FileService.UpdateFileById(id, req.files.file, (err) => {
                    if(err){
                        res.status(500).json({message: 'Failed to save on db'})
                    }else{
                        res.json({message: 'File updated'})
                    }
                })
            }
            else{
                res.status(400).json({message: 'No find file'})
            }
        }
        catch (e) {
            console.log(e)
            res.status(500).json({message: e})
        }
    }

    async FileList(req, res){
        try{
            const {page = 1, list_size = 10} = req.query
            const offset = (page - 1) * list_size

            FileService.FileList(offset, list_size, (err, info) => {
                if(!err){
                    res.status(500).json({message: 'No find files'})
                    return
                }
                if(info){
                    res.status(200).json(info)
                }
            })
        }
        catch (e) {
            res.status(500).json({message: e})
        }
    }
}

export default new fileController()