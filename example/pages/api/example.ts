import { RouteHandler, RouteHandlerMiddleware } from 'next-route-handler';

interface WUser {
	user: any;
}

/* 
	middleware can be specified as 
	'api' (for use in next.js api routes)
	'ssr' (for use in ssr functions like getServerSideProps)
	'both' (for use in both ssr and api routes)
*/
const exampleMiddleware: RouteHandlerMiddleware<'api', WUser> = {
	middleware: (req, res, end, env) => {
		req.user = req.body; // edit request body for the handler to make use of
		env; // the execution environment of the middleware ('ssr' or 'api')
		/* return end((lastRes) => console.log(lastRes)) */ // end execution of the route and do something with the response
	}, // the middleware function to be run
	key: 'example', // a unique key to identify the middleware
	ssr: false, // whether this middleware works in ssr
};

export default new RouteHandler<'api', WUser>()
	.use(exampleMiddleware)
	.get((req, res) => res.status(200).json({ message: 'I was gotten (GET method)' }))
	.post((req, res) =>
		res.status(200).json({ message: `I was posted by ${req.user} (POST method)` }),
	)
	.patch((req, res) => res.status(200).json({ message: 'I was patched (PATCH method)' }))
	.put((req, res) => res.status(200).json({ message: 'I was put (PUT method)' }))
	.delete(
		(req, res) =>
			res.status(200).json({ message: `I was deleted by ${req.user} (DELETE method)` }),
		['example'], // this handler with ignore middleware with a key of example
	);
