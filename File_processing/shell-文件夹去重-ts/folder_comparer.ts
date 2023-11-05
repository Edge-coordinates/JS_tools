#!/usr/bin/env node

// 导入所需的模块
import inquirer, { QuestionCollection } from 'inquirer'
import { Command } from 'commander'

const program = new Command()

// 定义命令行选项和参数
program
  .version('1.0.0')
  .description('一个示例命令行脚本')
  .option('-a, --first <folder name>', '第一个文件夹')
  .option('-b, --second <folder name>', '第二个文件夹')

program.parse()

const options = program.opts()
// 检查是否提供了两个文件夹

if (!options.first || !options.second) {
  console.error('请提供两个文件夹！')
  program.help() //s输出帮助信息
}

// 执行相应的操作
console.log(options)
const first_folder_path = options.first
const second_folder_path = options.second
// 判断是否为合法文件夹 TODO
const askQuestions = () => {
  const questions: QuestionCollection = [
    {
      name: 'confirm_message',
      type: 'confirm',
      message: '确定执行删除操作码？不可恢复'
    }
  ]
  return inquirer.prompt(questions)
}

import fs from 'fs'
import path from 'path'

function findDuplicateFiles (directoryA, directoryB) {
  // 读取目录A中的文件列表
  const filesA = fs.readdirSync(directoryA)
  let cont = 0
  // 遍历目录A中的文件
  filesA.forEach(fileA => {
    // 获取文件A的完整路径
    const filePathA = path.join(directoryA, fileA)

    // 获取文件B的完整路径
    const filePathB = path.join(directoryB, fileA)

    try {
      // 检查文件B是否存在
      fs.accessSync(filePathB)

      // 如果文件B存在，则删除文件B
      fs.unlinkSync(filePathB)
      cont ++
      // 打印删除的文件路径
      console.log('Deleted:', filePathB)

    } catch (error) {
      // 文件B不存在，忽略错误
    }
  })
  console.log('共删除 %d 个文件', cont)
}

// 确认是否执行
const run = async () => {
  const answers = await askQuestions()
  const { confirm_message } = answers
  if (!confirm_message) {
    program.help()
  }
  findDuplicateFiles(first_folder_path, second_folder_path)
}

run()
