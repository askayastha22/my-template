const Generator = require('yeoman-generator')
const path = require('path')

/*
      'initializing',
      'prompting',
      'configuring',
      'default',
      'writing',
      'conflicts',
      'install',
      'end'
      */

class TheGenerator extends Generator {
  constructor (args, opts) {
    super(args, opts)

    // options are inputs from CLI or yeoman parent generator
    this.option('dest-folder', { type: String, default: '.' })
    this.option('project-name', { type: String, default: 'project-name-not-set' })

    // props are used by templates
    this.props = {
      destFolder: this.options['dest-folder'],
      projectName: this.options['project-name']
    }
  }

  async initializing () {
    this.log("In initializing...")
  }

  async prompting() {
    const answers = await this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your project name",
        default: this.appname // Default to current folder name
      },
      {
        type: "confirm",
        name: "cool",
        message: "Would you like to enable the Cool feature?"
      }
    ]);

    this.log("app name", answers.name);
    this.log("cool feature", answers.cool);
  }

  async writing () {
    const destFolder = this.props.destFolder
    this.sourceRoot(path.join(__dirname, './templates/'))

    // all files in the templates sub-folder will be copied to destFolder, except files with underscore
    this.fs.copyTpl(
      this.templatePath('**/*'),
      this.destinationPath(destFolder),
      this.props,
      {},
      { globOptions: { ignore: ['**/_*.*'] } }
    )

    // this is an example of how to copy a dotfile, we prefix it with _dot. and copy after
    // npm pack will not include .gitignore template files so we need to rename it
    // see https://github.com/npm/npm/issues/3763
    this.fs.copyTpl(
      this.templatePath('_dot.gitignore'),
      this.destinationPath(path.join(destFolder, '.gitignore')),
      this.props
    )
  }
}

module.exports = TheGenerator
