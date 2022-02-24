import { Anchor, Tabs, TextInput } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { Prism } from '@mantine/prism';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';

const exampleRouteCode = `import { RouteHandler, RouteHandlerMiddleware } from 'next-route-handler';

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
		
		/* return end((lastRes) => res.status(403).json({ message: "you are not authorized." })) */ // end execution of the route and do something with the response
	
	}, // the middleware function to be run
	key: 'example', // a unique key to identify the middleware
	ssr: false, // whether this middleware works in ssr
};

export default new RouteHandler<'api', WUser>()
	.use(exampleMiddleware)
	.get((req, res) => res.status(200).json({ message: 'I was gotten (GET method)' }))
	.post((req, res) =>
		res.status(200).json({ message: \`I was posted by \${req.user} (POST method)\` }),
	)
	.patch((req, res) => res.status(200).json({ message: \`I was patched by \${req.user} (PATCH method)\` }))
	.put((req, res) => res.status(200).json({ message: 'I was put (PUT method)' }))
	.delete(
		(req, res) =>
			res.status(200).json({ message: \`I was deleted by \${req.user} (DELETE method)\` }),
		['example'], // this handler with ignore middleware with a key of example
	);
`

const Home: NextPage = () => {
	const [results, setResults] = useState<{
		get: any;
		post: any;
		patch: any;
		put: any;
		delete: any;
	}>({ get: undefined, post: undefined, patch: undefined, put: undefined, delete: undefined });
	const [username, setUsername] = useState('Tsar');
	const [debouncedUsername] = useDebouncedValue(username, 300);

	// done loading when all are defined
	const loading: boolean =
		!results.get || !results.post || !results.patch || !results.put || !results.delete;

	useEffect(() => {
		fetch('/api/example', { method: 'GET' }).then(async (res) => {
			const json = await res.json();
			setResults((prev) => ({ ...prev, get: json }));
		});
		fetch('/api/example', { method: 'PUT' }).then(async (res) => {
			const json = await res.json();
			setResults((prev) => ({ ...prev, put: json }));
		});
	}, []);

	useEffect(() => {
		fetch('/api/example', { method: 'POST', body: debouncedUsername }).then(async (res) => {
			const json = await res.json();
			setResults((prev) => ({ ...prev, post: json }));
		});
		fetch('/api/example', { method: 'PATCH', body: debouncedUsername }).then(async (res) => {
			const json = await res.json();
			setResults((prev) => ({ ...prev, patch: json }));
		});
		fetch('/api/example', { method: 'DELETE', body: debouncedUsername }).then(async (res) => {
			const json = await res.json();
			setResults((prev) => ({ ...prev, delete: json }));
		});
	}, [debouncedUsername]);

	return (
		<>
			<h1 style={{ margin: 0 }}>Next Route Handler</h1>

			<TextInput label='Username' value={username} onChange={(e) => setUsername(e.target.value)} />

			{loading ? (
				<Tabs>
					<Tabs.Tab label='Loading...'>
						<p>loading...</p>
					</Tabs.Tab>
				</Tabs>
			) : (
				<Tabs>
					<Tabs.Tab label='GET'>
						<h3>Get Example</h3>
						<p>result: {results.get.message}</p>
					</Tabs.Tab>
					<Tabs.Tab label='POST'>
						<h3>Post Example</h3>
						<p>result: {results.post.message}</p>
					</Tabs.Tab>
					<Tabs.Tab label='PATCH'>
						<h3>Patch Example</h3>
						<p>result: {results.patch.message}</p>
					</Tabs.Tab>
					<Tabs.Tab label='PUT'>
						<h3>Put Example</h3>
						<p>result: {results.put.message}</p>
					</Tabs.Tab>
					<Tabs.Tab label='DELETE'>
						<h3>Delete Example</h3>
						<p>result: {results.delete.message}</p>
					</Tabs.Tab>
				</Tabs>
			)}
			<h2 style={{ marginTop: '3rem', marginBottom: 0 }}>Example route code</h2>
			<p>This is the code used for the examples above</p>
			<Prism style={{ margin: '1rem', tabSize: 4 }} withLineNumbers language='typescript'>{exampleRouteCode}</Prism>
			<p>Check out the source code on <Anchor href='https://github.com/tsar-boomba/next-route-handler/'>GitHub</Anchor></p>
		</>
	);
};

export default Home;
