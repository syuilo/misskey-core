'use strict';

require('shelljs/global');
const gulp = require('gulp');
const babel = require('gulp-babel');
const ts = require('gulp-typescript');
const tslint = require('gulp-tslint');
const es = require('event-stream');

const project = ts.createProject('tsconfig.json');

gulp.task('build', [
	'build:js',
	'build:ts',
	'build:copy'
]);

gulp.task('buildall', [
	'build:js',
	'build:ts',
	'build:client',
	'build:copy'
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
	const meta = require('./built/meta');

	cd('./src/web');
	exec('npm install');
	exec('bower install --allow-root');
	exec(`gulp build --url=${config.url} --theme-color=${meta.themeColor} --proxy-url=${config.proxy.url} --recaptcha-siteKey=${config.recaptcha.siteKey}`);
});

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
