declare var IS_PRODUCTION: boolean;
declare var IS_DEBUG: boolean;

declare module NodeJS  {
	interface Global {
		IS_PRODUCTION: boolean;
		IS_DEBUG: boolean;
	}
}
