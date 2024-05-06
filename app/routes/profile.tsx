import {
  ActionFunctionArgs,
  LoaderFunction,
  json,
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
  writeAsyncIterableToWritable,
} from "@remix-run/node";
import { useLoaderData, Form, useActionData } from "@remix-run/react";
import { DiscordUser, auth } from "~/auth.server";
import Nav from "~/components/nav";
import { Button } from "~/components/ui/button";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "~/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  S3Client,
  ListBucketsCommand,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { sessionStorage } from "~/session.server";

export let loader: LoaderFunction = async ({ request }) => {
  const S3 = new S3Client({
    region: "auto",
    endpoint: process.env.CLOUDFLARE_S3!,
    credentials: {
      accessKeyId: process.env.ACCESS_KEY_ID!,
      secretAccessKey: process.env.SECRET_ACCESS_KEY!,
    },
  });

  const authenticated = await auth.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  let commonGuilds: Guild[] = [];
  if (authenticated) {
    let userGuilds = await fetchUserGuilds(authenticated.accessToken);
    let botGuilds = await fetchBotGuilds();
    commonGuilds = userGuilds.filter((userGuild: any) =>
      botGuilds.some((botGuild: any) => botGuild.id === userGuild.id)
    );
  }

  const image = new ListObjectsV2Command({
    Bucket: "aylani",
    Prefix: `uploads/${authenticated.id}`, // Only list objects that start with the user ID
  });
  if (image) {
    const { Contents } = await S3.send(image);
    const files = Contents!.map((item: any) => ({
      key: item.Key,
      url: process.env.CLOUDFLARE_S3! + "/" + item.Key,
    }));
    console.log(files);
    return { authenticated, commonGuilds, files };
  } else {
    let file =
      "https://raw.githubusercontent.com/Wesleyvdk/images/main/1ec06e9864d623549da40633c679cc2a.webp";
    return { authenticated, commonGuilds, file, S3 };
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  const user = session.get("user");
  const S3 = new S3Client({
    region: "auto",
    endpoint: process.env.CLOUDFLARE_S3!,
    credentials: {
      accessKeyId: process.env.ACCESS_KEY_ID!,
      secretAccessKey: process.env.SECRET_ACCESS_KEY!,
    },
  });

  const formData = await request.formData();
  const file = formData.get("avatar");
  if (!file || typeof file === "string") {
    return json({ error: "No file uploaded" }, { status: 400 });
  }

  const validExtensions = ["png", "jpg", "jpeg", "webp"];
  const extension = file.name.split(".").pop();
  if (!validExtensions.includes(extension!)) {
    return json({ error: "Invalid file type" }, { status: 400 });
  }

  const listCommand = new ListObjectsV2Command({
    Bucket: "aylani",
    Prefix: `uploads/${user.id}/`,
  });
  const { Contents } = await S3.send(listCommand);

  if (Contents!.length > 0) {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: "aylani",
      Key: Contents![0].Key,
    });
    await S3.send(deleteCommand);
  }
  const buffer = await file.arrayBuffer();

  const upload = new Upload({
    client: S3,
    params: {
      Bucket: "aylani", // Replace with your R2 bucket name
      Key: `uploads/${user.id}/${file.name}`, // File path and name in the bucket
      Body: Buffer.from(buffer), // The file data
    },
  });

  try {
    const result = await upload.done();
    return result;
  } catch (err) {
    console.error("Error uploading:", err);
    throw err;
  }
};

export default function Profile() {
  const { authenticated, commonGuilds, files, S3 } =
    useLoaderData<typeof loader>();
  const actionData: any = useActionData();
  let user = authenticated;
  return (
    <div className="p-4 md:p-10 mx-auto">
      <Nav />
      <main className="flex-1 grid grid-cols-[1fr_300px] gap-6 p-6">
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4">RPG Adventurers</h2>
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Warrior</CardTitle>
                  <CardDescription>Level 15</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Strength</p>
                      <p className="text-lg font-semibold">85</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Dexterity</p>
                      <p className="text-lg font-semibold">70</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Intelligence</p>
                      <p className="text-lg font-semibold">50</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="blur-sm">
                  <CardTitle>Mage</CardTitle>
                  <CardDescription>Level 12</CardDescription>
                </CardHeader>
                <CardContent className="blur-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Strength</p>
                      <p className="text-lg font-semibold">40</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Dexterity</p>
                      <p className="text-lg font-semibold">65</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Intelligence</p>
                      <p className="text-lg font-semibold">90</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-4">Common Servers</h2>
            <div className="grid grid-cols-2 gap-4">
              {commonGuilds.map((guild: Guild) => (
                <Card key={guild.id}>
                  <CardHeader>
                    <CardTitle>{guild.name}</CardTitle>
                    <CardDescription>Leaderboard #3</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Members</p>
                        <p className="text-lg font-semibold">
                          {guild.approximate_member_count}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Online</p>
                        <p className="text-lg font-semibold">
                          {guild.approximate_presence_count}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Uptime</p>
                        <p className="text-lg font-semibold">99.9%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
        <div className="py-11 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Level Command</CardTitle>
              <CardDescription>
                Customize your level command banner
              </CardDescription>
            </CardHeader>
            <CardContent>
              {files.map((file: any) => (
                <div
                  className="flex flex-col items-center gap-4"
                  key={file.key}
                >
                  <img
                    alt="Level Command Banner"
                    className="rounded-lg"
                    height="200"
                    src={file.url}
                    style={{
                      aspectRatio: "400/200",
                      objectFit: "cover",
                    }}
                    width="400"
                  />
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        Edit Banner
                        <PencilIcon className="ml-2 h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-100 sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="flex">
                          Edit Banner
                          <PencilIcon className="ml-2 h-4 w-4" />
                        </DialogTitle>
                        <DialogDescription>
                          Make changes to your profile here.
                        </DialogDescription>
                        {actionData?.error && (
                          <p style={{ color: "red" }}>{actionData.error}</p>
                        )}
                      </DialogHeader>
                      <Form method="post" encType="multipart/form-data">
                        <div className="flex items-center space-x-2">
                          <div className="grid flex-1 gap-4">
                            <Input
                              id="avatar-input"
                              type="file"
                              name="avatar"
                            />
                          </div>
                        </div>
                        <DialogFooter className="mt-4">
                          <Button type="submit" variant="outline">
                            Save changes
                          </Button>
                        </DialogFooter>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function PencilIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}

async function fetchUserGuilds(accessToken: string) {
  try {
    let guilds: Guild[] = await fetch(
      "https://discordapp.com/api/users/@me/guilds?" +
        new URLSearchParams({
          with_counts: "true",
        }),
      {
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
      }
    ).then((response) => response.json());
    // console.log(guilds);

    return Array.isArray(guilds) ? guilds : [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function fetchBotGuilds() {
  try {
    let botGuilds: Guild[] = await fetch(
      "https://discordapp.com/api/users/@me/guilds?" +
        new URLSearchParams({
          with_counts: "true",
        }),
      {
        headers: {
          Authorization: "Bot " + process.env.DISCORD_BOT_TOKEN,
          "Content-Type": "application/json",
        },
      }
    ).then((response) => response.json());
    //console.log(botGuilds);

    return Array.isArray(botGuilds) ? botGuilds : [];
  } catch (error) {
    console.error(error);
    return [];
  }
}
