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

gulp.task('build:js', () =>
	gulp.src('./src/**/*.js')
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

gulp.task('build:styles', () =>
	gulp.src('./src/web/**/*.styl')
		.pipe(stylus())
		.pipe(gulp.dest('./built/web/'))
);

gulp.task('build:copy', () => {
	let copyResources = gulp.src([
			'./src/resources/**/*'
		]).pipe(gulp.dest('./built/resources/'));

	let copyWeb = gulp.src([
			'./src/web/**/*',
			'!**/*.ts',
			'!**/*.ls',
			'!**/*.styl'
		]).pipe(gulp.dest('./built/web/'));

	return es.merge(copyResources, copyWeb);
});

gulp.task('test', ['lint', 'build']);

gulp.task('lint', () =>
	gulp.src('./src/**/*.ts')
		.pipe(tslint({
			formatter: "verbose"
		}))
		.pipe(tslint.report())
);
