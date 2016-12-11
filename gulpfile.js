'use strict';

require('shelljs/global');
const gulp = require('gulp');
const babel = require('gulp-babel');
const ts = require('gulp-typescript');
const tslint = require('gulp-tslint');
const git = require('git-last-commit');

const env = process.env.NODE_ENV;
const isProduction = env === 'production';
const isDebug = !isProduction;

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

gulp.task('build:client', ['build:ts', 'build:js'], cb => {
	const config = require('./built/config').default;

	// Get commit info
	git.getLastCommit((err, commit) => {
		cd(isProduction ? './node_modules/misskey-web' : './../misskey-web/');
		exec(`npm run build -- --url=${config.url} --recaptcha-sitekey=${config.recaptcha.siteKey} --version=${commit.hash}`);
		cd(__dirname);

		gulp.src(isProduction ? './node_modules/misskey-web/built/**/*' : './../misskey-web/built/**/*')
			.pipe(gulp.dest('./built/web/client/'))
			.on('end', cb);
	});
});

gulp.task('build:copy', () => {
	return gulp.src([
		'./src/**/resources/**/*'
	]).pipe(gulp.dest('./built/'));
});

gulp.task('test', ['lint', 'buildall']);

gulp.task('lint', () =>
	gulp.src('./src/**/*.ts')
		.pipe(tslint({
			formatter: "verbose"
		}))
		.pipe(tslint.report())
);
