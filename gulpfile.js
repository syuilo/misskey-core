/****************************
 * Misskey Core gulp settings
 ****************************/

'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');
const ts = require('gulp-typescript');
const tslint = require('gulp-tslint');
const stylus = require('gulp-stylus');
const es = require('event-stream');

const project = ts.createProject('tsconfig.json');

gulp.task('build', [
	'build:js',
	'build:ts',
	'build:styles',
	'build:copy'
]);

gulp.task('build:js', () => {
	return gulp.src('./src/**/*.js')
		.pipe(babel({
			presets: ['es2015', 'stage-3']
		}))
		.pipe(gulp.dest('./built/'));
});

gulp.task('build:ts', () => {
	project
		.src()
		.pipe(ts(project))
		.pipe(babel({
			presets: ['es2015', 'stage-3']
		}))
		.pipe(gulp.dest('./built/'));
});

gulp.task('build:styles', () => {
	return gulp.src('./src/web/**/*.styl')
		.pipe(stylus())
		.pipe(gulp.dest('./built/web/'));
});

gulp.task('build:copy', () => {
	return es.merge(
		gulp.src([
			'./src/resources/**/*'
		]).pipe(gulp.dest('./built/resources/')),
		gulp.src([
			'./src/web/**/*',
			'!**/*.ts',
			'!**/*.ls',
			'!**/*.styl'
		]).pipe(gulp.dest('./built/web/'))
	);
});

gulp.task('test', [
	'lint'
]);

gulp.task('lint', () =>
	gulp.src('./src/**/*.ts')
		.pipe(tslint({
			formatter: "verbose"
		}))
		.pipe(tslint.report())
);
