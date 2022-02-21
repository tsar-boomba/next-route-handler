import { RouteHandler } from 'next-route-handler';

export default new RouteHandler().get((req, res) =>
	res.status(200).json({ message: 'I was gotten (GET method)' }),
);
