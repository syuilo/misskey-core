export default function(text: string): string[] {
	if (text === null) {
		return [];
	}

	const tags = text.trim().match(/(^|\s)#(\S+)/g);

	return (tags !== null ? tags : [])
		.map(tag => tag.trim())
		.map(tag => tag.replace('#', '')) // 先頭の#を除去
		.filter(tag => tag !== '')
		.filter(tag => tag.indexOf('#') === -1); // 複数の#が含まれていたら不正なので弾く
}
