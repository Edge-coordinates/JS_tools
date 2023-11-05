#!/usr/bin/env node

// 导入所需的模块
import * as inquirer from 'inquirer'
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
const fist_folder_path = options.first
const second_folder_path = options.second
// 判断是否为合法文件夹 TODO
const askQuestions = () => {
  const questions = [
    {
      name: 'confirm_message',
      type: 'input',
      message: 'What is the name of the file without extension?'
    }
  ]
  return inquirer.prompt(questions)
}

// 确认是否执行
const run = async () => {
  const answers = await askQuestions()
  const { confirm_message } = answers

  console.log(confirm_message)
}

run()


