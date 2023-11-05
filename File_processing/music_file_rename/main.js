#!/usr/bin/env node

// 导入所需的模块
import inquirer from 'inquirer'
import { Command } from 'commander'

const program = new Command()

// 定义命令行选项和参数
program
    .version('1.0.0')
    .description(
        '重命名音乐文件，用于调转音乐文件的名称顺序。\n 示例：歌曲名 - 歌手名 经过处理将会变成 歌手名 - 歌曲名，反之亦然。 \n '
    )
    .option('-f, --first <folder name>', '文件夹路径')

program.parse()

const options = program.opts()
// 检查是否提供了两个文件夹

if (!options.first) {
    console.error('请提供文件夹路径！')
    program.help() //s输出帮助信息
}

// 执行相应的操作
// console.log(options)
const folder_path = options.first
// 判断是否为合法文件夹 TODO
const confrim_do = () => {
    const questions = [
        {
            name: 'confirm_message',
            type: 'confirm',
            message: '确定进行重命名嘛？',
        },
    ]
    return inquirer.prompt(questions)
}

const model_chose = () => {
    const questions = [
        {
            name: 'ifrecursion',
            type: 'confirm',
            message: '递归遍历模式？',
        },
    ]
    return inquirer.prompt(questions)
}

import fs from 'fs'
import path from 'path'

const musicExtensions = ['.mp3', '.wav', '.ogg', '.flac', '.m4a', '.wma']
let recursion_model

function traverseFolder(folderPath) {
    console.log(folderPath)
    // 读取文件夹中的所有文件和子文件夹
    const files = fs.readdirSync(folderPath)

    // 遍历每个文件/文件夹
    for (const file of files) {
        const filePath = path.join(folderPath, file)
        const stats = fs.statSync(filePath)

        // 检查是文件还是文件夹
        if (stats.isFile()) {
            // 检查文件扩展名是否匹配音乐格式
            if (musicExtensions.includes(path.extname(file).toLowerCase())) {
                // 匹配到音乐文件，执行您的操作
                console.log('音乐文件:', file)
                const baseName = file.split('.').slice(0, -1).join('.')
                const extensionName = file.split('.').pop()
                let match_word = ' - '
                const newName = baseName.split(match_word)[1] + match_word + baseName.split(match_word)[0] + '.' + extensionName
                const newFilePath = path.join(folderPath, newName)
                fs.rename(filePath, newFilePath, (err) => {
                    if (err) {
                        console.error('重命名文件时出错:', err)
                    } else {
                        console.log('生成文件：', newName)
                    }
                })
                // console.log(baseName, extensionName, file, newName)
            }
        } else if (stats.isDirectory() && recursion_model) {
            // 如果是文件夹，递归遍历子文件夹
            console.log('子文件夹：', file)
            traverseFolder(filePath)
        }
    }
}

// function main(folder_path) {
//     console.log(folder_path, recursion_model)
// }

// 确认是否执行
const run = async () => {
    let answers
    answers = await model_chose()
    const { ifrecursion } = answers
    recursion_model = ifrecursion
    answers = await confrim_do()
    const { confirm_message } = answers
    //   console.log(confirm_message)
    if (confirm_message) {
        // main(folder_path)
        traverseFolder(folder_path)
    }
}

run()
