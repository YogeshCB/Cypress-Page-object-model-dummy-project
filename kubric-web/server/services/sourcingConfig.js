export default {
	headers: {},
	resources: {
		sourcing: {
			services: {
				getImageBank: {
					host: "https://storage.googleapis.com",
					method: "get",
					path: "/kubric-temp/bank.json",
					type: "auto"
				}
			}
		}
	}
};
