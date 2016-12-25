'use strict';

require('shelljs/global');
const gulp = require('gulp');
const babel = require('gulp-babel');
const ts = require('gulp-typescript');
const tslint = require('gulp-tslint');

const env = process.env.NODE_ENV;
const isProduction = env === 'production';
const isDebug = !isProduction;

const project = ts.createProject('tsconfig.json');

gulp.task('build', [
	'build:js',
	'build:ts',
	'build:copy',
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

	cd(isProduction ? './misskey-web/' : './../misskey-web/');
	exec('npm install');
	exec(`npm run build -- --url=${config.url} --recaptcha-sitekey=${config.recaptcha.siteKey}`);
	cd(__dirname);

	return gulp.src(isProduction ? './misskey-web/built/**/*' : './../misskey-web/built/**/*')
		.pipe(gulp.dest('./built/web/client/'));
});

gulp.task('build:copy', () => {
	gulp.src([
		'./src/**/resources/**/*'
	]).pipe(gulp.dest('./built/'));
	gulp.src([
		'./src/web/about/**/*'
	]).pipe(gulp.dest('./built/web/about/'));
});

gulp.task('test', ['lint', 'build']);

gulp.task('lint', () =>
	gulp.src('./src/**/*.ts')
		.pipe(tslint({
			formatter: "verbose"
		}))
		.pipe(tslint.report())
);
