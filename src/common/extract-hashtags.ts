export default function(text: string): string[] {
	if (text === null) {
		return [];
	}

	const tags = text.trim().match(/(^|\s)#(\S+)/g);

	return (tags !== null ? tags : [])
		.map(tag => tag.trim())
		.map(tag => tag.replace('#', '')) // Eliminate # at the head
		.filter(tag => tag !== '')
		.filter(tag => tag.indexOf('#') === -1); // Kick if it contains more than one #
}
