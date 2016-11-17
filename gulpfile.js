'use strict';

require('shelljs/global');
const gulp = require('gulp');
const babel = require('gulp-babel');
const ts = require('gulp-typescript');
const tslint = require('gulp-tslint');

const project = ts.createProject('tsconfig.json');

gulp.task('build', [
	'build:js',
	'build:ts',
	'build:copy'
]);

gulp.task('buildall', [
	'build',
	'build:client'
]);

gulp.task('build:js', () =>
	gulp.src(['./src/**/*.js', '!./src/web/**/*.js'])
		.pipe(babel({
			presets: ['es2015', 'stage-3']
		}))
		.pipe(gulp.dest('./built/'))
);

gulp.task('build:ts', () =>
	project
		.src()
		.pipe(project())
		.pipe(babel({
			presets: ['es2015', 'stage-3']
		}))
		.pipe(gulp.dest('./built/'))
);

gulp.task('build:client', ['build:ts', 'build:js'], () => {
	const config = require('./built/config').default;

	cd('./src/web');
	exec('npm install');
	exec('bower install --allow-root');
	exec(`gulp build --url=${config.url} --proxy-url=${config.proxy.url} --recaptcha-siteKey=${config.recaptcha.siteKey}`);
	cd('../../');

	return gulp.src([
		'./src/web/built/**/*',
		'!**/*.ts',
		'!**/*.ls',
		'!**/*.styl'
	]).pipe(gulp.dest('./built/web/'));
});

gulp.task('build:copy', () => {
	return gulp.src([
		'./src/resources/**/*'
	]).pipe(gulp.dest('./built/resources/'));
});

gulp.task('test', ['lint', 'build']);

gulp.task('lint', () =>
	gulp.src('./src/**/*.ts')
		.pipe(tslint({
			formatter: "verbose"
		}))
		.pipe(tslint.report())
);
