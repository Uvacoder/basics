// need self in workers
/* eslint-disable no-restricted-globals */
const count = (from, to) => {
	for (let current = from; current <= to; current++) {
		if (current === to) {
			self.postMessage({ finished: true });
		}
	}
};

self.addEventListener("message", (event) => {
	const virtualDom = JSON.parse(event.data.html);

	const findElements = (needle, haystack) => {
		const found = [];

		const splitSelector = (selector) => {
			const selectorList = [];

			selector.split(" ").forEach((level) => {
				const regex = new RegExp(
					/(?:\.(?<class>\w+))|(?:#(?<id>\w+))|(?:\[(?<attr>.*)\])|(?<tag>\w+)/gs
				);
				const match = [...level.matchAll(regex)];

				selectorList.push({
					tagName: Array.from(match).map((x) => x.groups.tag)[0],
					classList: Array.from(match).map((x) => x.groups.class),
					id: Array.from(match).map((x) => x.groups.id)[0],
					attrList: Array.from(match).map((x) => x.groups.attr),
				});
			});

			return selectorList;
		};

		const matchesTagName = (sel, el) => {
			return sel.tagName
				? el.tagName.toLowerCase() === sel.tagName.toLowerCase()
				: false;
		};

		const matchesClassList = (sel, el) => {
			const elClasses = el.attributes
				.filter((attr) => attr.name === "class")
				.shift();

			return sel.classList && elClasses
				? sel.classList.every((x) =>
						elClasses.value.split(" ").includes(x)
				  )
				: false;
		};

		const matchesId = (sel, el) => {
			return sel.id
				? el.id.toLowerCase() === sel.id.toLowerCase()
				: false;
		};

		matchesAttrList = (sel, el) => {
			// todo: doesnt match correctly yet
			const elAttributes = el.attributes
				.filter((attr) => attr.name === "class")
				.shift();

			return sel.attrList && elAttributes
				? sel.attrList.every((x) =>
						elAttributes.value.split(" ").includes(x)
				  )
				: false;
		};

		const recursiveFindIn = (elements) => {
			elements.forEach((element) => {
				const selector = splitSelector(needle)[0];

				if (
					matchesTagName(selector, element) ||
					matchesClassList(selector, element) ||
					matchesId(selector, element) ||
					matchesAttrList(selector, element)
				) {
					found.push(element);
				}

				if (element.children) {
					recursiveFindIn(element.children);
				}
			});
		};

		recursiveFindIn(haystack);
		return found;
	};

	const header = findElements(
		'[data-component="header"][data-state-menu-button="inactive"]',
		virtualDom.children
	);
	console.log(header);

	if (event.data.count) {
		count(
			event.data.count.from ? event.data.count.from : 0,
			event.data.count.to ? event.data.count.to : 0
		);
	}
});
