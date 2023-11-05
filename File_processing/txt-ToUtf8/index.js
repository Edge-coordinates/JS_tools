const fs = require('fs-extra')
const path = require('path')
const utf8 = require('to-utf-8')
const jschardet = require('jschardet')
const iconv = require('iconv-lite')

// 读取配置文件
const config = require('./config.json')
const allowedExtensions = config.allowedExtensions
const rootFolder = config.rootFolder
const outputEncoding = config.outputEncoding

let filelist = []

// 遍历文件夹并查找指定扩展名的文件
function searchFiles(directory) {
    const files = fs.readdirSync(directory)

    for (const file of files) {
        const filePath = path.join(directory, file)
        const fileStat = fs.statSync(filePath)

        if (fileStat.isDirectory()) {
            // 如果是文件夹，则递归遍历文件夹
            searchFiles(filePath)
        } else {
            // 如果是文件，检查扩展名是否匹配
            const fileExtension = path.extname(file)
            if (allowedExtensions.includes(fileExtension)) {
                // console.log('file:', filePath);
                // 这里可以执行你需要的操作，比如复制、移动或处理文件
                filelist.push(filePath)
            }
        }
    }
}

function stream2buffer(stream) {
    return new Promise((resolve, reject) => {
        const _buf = []

        stream.on('data', (chunk) => _buf.push(chunk))
        stream.on('end', () => resolve(Buffer.concat(_buf)))
        stream.on('error', (err) => reject(err))
    })
}

function convertFileName(thepath) {

    // 获取文件名和文件扩展名
    const fileName = path.basename(
        thepath,
        path.extname(thepath)
    )
    const fileExtension = path.extname(thepath)

    // 构造新的文件名，添加 "utf8" 到文件名末尾
    const newFileName = fileName + '.utf8' + fileExtension

    // 构造新的路径
    const newFilePath = path.join(path.dirname(thepath), newFileName)

    return newFilePath
}

function toUTF8() {
    filelist.forEach((current) => {
        console.log('开始转换：', current)
        let readstream = fs.createReadStream(current)
        stream2buffer(readstream).then((data) => {
            // console.log(data)
            // console.log(jschardet.detect(data))
            console.log(jschardet.detectAll(data))
            const enct = jschardet.detectAll(data)[0].encoding
            if (enct == 'UTF-8') return
            let str = iconv.decode(data, enct)

            console.log(str)

            //将编码后的内容写入输出文件
            let outputFilePath = convertFileName(current)
            fs.writeFile(outputFilePath, str, outputEncoding, (err) => {
                if (err) {
                    console.error('Error writing the file:', err)
                    return
                }
                console.log('转换完成：', outputFilePath)
            })
        })
    })
}

// 开始遍历根文件夹
// 获取所有具有指定后缀的文件
searchFiles(rootFolder)

// console.log(filelist)

toUTF8()

// console.log(convertFileName('/path/to/your/file.txt'))