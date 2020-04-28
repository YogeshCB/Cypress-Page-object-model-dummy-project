import Express from "express";
import sourcingServices from "../services/sourcing";
const Router = Express.Router();

Router.get("/getImageBank", (req, res, next) => {
	sourcingServices.sourcing
		.getImageBank()
		.send()
		.then(data => {
			res.send({ data: data });
		})
		.catch(error => {
			console.log(error);
		});
});

export default Router;
