# Kickoff

Kick start the development of a website or web application.

## Getting Started

Either clone this repo, or utilise the bash alias detailed below. If you plan on using any of the preconfigured Gulp tasks, make sure you run `npm install` first - this will pull in any required dependencies.

That's it! You're good to go.

## Alias

To conveniently use this repo, I recommend adding the following alias to your .bash_aliases file:

```
function kickoff() {
    echo "Cloning Kickoff repository..."
    git clone git@bitbucket.org:club/kickoff.git .
    echo "Removing .git directory..."
    rm .git -r -f
    echo "Done. Happy coding!"
}
```
When you start a new project, just open a terminal window, type `kickoff` and hit return and the alias will pull in this repository to the current directory and then remove the repos `.git` folder, allowing you to immediately initialise a new Git repository for your project without any faff.

## Assets

The `/assets` directory provides a predefined directory structure that should be suitable for the vast majority of websites and applications.

By default, `/assets` includes the following directories:

* **/img**

  All images used within stylesheets are to to placed here. They will automatically be optimised and moved to `public/img` by the `imagemin` Gulp task.

* **/js**

  Javascript goes here. The Gulp task `uglify` will concatenate and minify these files in accordance with the task settings within `gulpfile.js`.

* **/sass**
  * **/base**

    `_base.scss` - None layout, theme specific style go here.

  * **/config**

    `_config.scss` - Define any SASS variables for use throughout the project in this file.

  * **/components**

    Styles for individual site elements that are used to build up pages should be placed here.

  * **/helpers**

    Mixins and functions should be placed here. By default blank `_mixins.scss` and `_funcions.scss` files are included for convenience.

  * **/vendor**

      `_getup.scss` - A single point for pulling in Club Getup files.

    This would generally contain any vendor styles that need to manually be included, because they're not available via Bower.

  * **main.scss**

    The project's core stylesheet. Each file from the sub-folders should be included within this file. Placing CSS in this file is not recommended.

## Public

The web root of the application.

A sample `robots.txt` file is also included for convenience.

## Metafiles

### .bowerrc

Ensures that your bower dependencies are organised nicely in the `vendor` directory, along with any Composer dependencies.

### .gitattributes

Settings to normalise line endings within the Git repository.

### .gitignore

Project specific files and folders to be ignored. The contents of this file is minimal because the majority of standard ignores should be set within a global .gitignore file.

If there isn't a global .gitignore file setup, here are some example additional entries for this file:

```
# OS Files
.DS_Store
.DS_Store?
Thumbs.db

# Web
/.idea
composer.phar
```

### gulpfile.js

Responsible for building the site assets ready for deployment.

#### Preconfigured Gulp Tasks:

##### clean ([gulp-clean]())
This task will delete any previously built assets from the build directories specified in the `project.json` file.

##### copy-components

Copies bower dependencies (as defined in `project.son`) from the `vendor/bower_components` directory to `public/js/vendor`. It will run any JS files through the `uglify` task to ensure they are minimised.

##### sass ([gulp-sass]())

Compiles SASS/SCSS from `resources/assets/sass` to CSS in `public/css`.

##### autoprefixer ([gulp-autoprefixer]())

Automatically adds vendor prefixes to compiled CSS.

##### uglify ([gulp-uglify]())

Minifies source Javascript from `resources/assets/js` with UglifyJS.

##### imagemin ([gulp-imagemin]())

Minifies images from `resources/assets/img` and saves them in `public/img`.

##### watch ([gulp-watch]())

Runs Gulp tasks when certain files are added, changed or deleted.

By default the watch task is configured to run the following tasks:

Watched Files                                 | Task
--------------------------------------------- | ------------
`resources/assets/js/**/*.js`                 | uglify
`resources/assets/sass/**/*.{scss,sass)`      | sass
`resources/assets/img/**/*.{png,jpg,gif,svg}` | imagemin
`public/css/**/*.css`                         | autoprefixer

##### Build

This task will run the following gulp tasks: `copy-components`, `sass`, `autoprefixer`, `uglify` and `imagemin`. This would generally be used before deploying to ensure that all assets have been processed.

### bower.json

Defines the default Bower dependencies. These are jQuery and HTML5shiv.

### package.json

Defines the dependencies required by Gulp for the tasks outlined above.
