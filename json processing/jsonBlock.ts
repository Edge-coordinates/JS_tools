// 导入所需的模块
import inquirer, { QuestionCollection } from 'inquirer'
import { Command } from 'commander'

const program = new Command()

// 定义命令行选项和参数
program
  .version('1.0.0')
  .description('一个示例命令行脚本')
  .option('-a, --name <file name>', 'Json文件名称，相对路径')
  .option('-b, --num <the list num>', '每个文件包含的列表数')

program.parse()

const options = program.opts()
console.log(options)
// 检查是否提供了两个文件夹

if (!options.name || !options.num) {
  console.error('请确认参数配置')
  program.help() //s输出帮助信息
}

// 执行相应的操作
const name = options.name
const num = Number(options.num)
// 判断是否为合法文件夹 TODO
const askQuestions = () => {
  const questions: QuestionCollection = [
    {
      name: 'confirm_message',
      type: 'confirm',
      message: '确认执行分块？'
    }
  ]
  return inquirer.prompt(questions)
}

import fs from 'fs'
import path from 'path'

function worker (name, num) {
  const fileName = path.parse(name).name
  fs.readFile(name, 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      return
    }

    const jsonData: any[] = JSON.parse(data)
    // console.log(jsonData);
    if (!Array.isArray(jsonData)) {
      console.log('请确保json文件为一个列表')
      return
    }
    let cnt = 0
    for (let i = 0; i < jsonData.length; i += num) {
      let tmp:any = jsonData.slice(i, i + num)
      //   console.log(jsonData.length,' ', i, '', tmp)
      let tmpfileName = fileName + '_' + cnt + '.json'
      cnt += 1
      fs.writeFile(tmpfileName, JSON.stringify(tmp), err => {
        if (err) {
          console.error(err)
          return
        }
        console.log('数据已成功写入文件', tmpfileName)
      })
    }
  })
}

// 确认是否执行
const run = async () => {
  const answers = await askQuestions()
  const { confirm_message } = answers
  if (!confirm_message) {
    program.help()
  }
  worker(name, num)
}

run()
