# Kickoff

Kick start the development of a website or web application. Hit the ground running with pre-configured Gulp tasks, linter configurations, a sensible directory structure and default meta files.

## Getting Started

Please refer to the [Kickoff Wiki](https://github.com/clubstudioltd/kickoff/wiki) for installation and usage instructions.

1. [Features](https://github.com/clubstudioltd/kickoff/wiki/01.-Features)
2. [Getting Started](https://github.com/clubstudioltd/kickoff/wiki/02.-Getting-Started)
3. [Directory Structure](https://github.com/clubstudioltd/kickoff/wiki/03.-Directory-Structure)
4. [Organising Assets](https://github.com/clubstudioltd/kickoff/wiki/04.-Organising-Assets)
5. [Public Directory](https://github.com/clubstudioltd/kickoff/wiki/05.-Public-Directory)
6. [Linting](https://github.com/clubstudioltd/kickoff/wiki/06.-Linting)
7. [Gulp Tasks](https://github.com/clubstudioltd/kickoff/wiki/07.-Gulp-Tasks)

## Twig Template Compilation

You can use Kickoff to quickly start building out frontend templates. The use of Twig allows you to organise your templates into partials etc.

Use the `--compileTemplates` flag on the `gulp`, `gulp production` and `gulp watch` commands to ensure your templates within the `templates` directory are compiled and output to the public directory.

Compile your templates manually using the `gulp compile-templates` task.

*Note:* Directories that start with an underscore `_` will be ignored and their contents will not be compiled.

## Kickoff Installer

Check out the [Kickoff Installer](https://github.com/clubstudioltd/kickoff-installer) package for a convenient way to start new web projects, with or without Kickoff.

## Feedback and Contributions

If you make use of this project please let us know; we'd love to hear if it has helped you and your team. If you have any suggestion or find any bugs please open a [pull request](https://github.com/clubstudioltd/kickoff/pulls) or [submit an issue](https://github.com/clubstudioltd/kickoff/issues).
