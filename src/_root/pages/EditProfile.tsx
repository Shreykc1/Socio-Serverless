import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ProfileValidation } from "@/lib/validation";
import FileUploader from "@/components/forms/FileUploader";
import { useUpdateUser } from "@/lib/react-query/queriesandmutations";

const EditProfile = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const { mutateAsync: updateUser, isPending: isLoadingUpdate } =
    useUpdateUser();

  // 1. Define your form.
  const form = useForm<z.infer<typeof ProfileValidation>>({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      file: [],
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio || "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof ProfileValidation>) {
    console.log("VAALLLS", values);
    const updatedUser = await updateUser({
      ...values,
      userID:user.id,
      imageID: user.imageID,
      imageURL: user.imageURL,

    });

    if (!updatedUser) {
      toast({
        title: `Pofile Update failed. Please try again.`,
      });
    } else {
      toast({
        title: `Pofile Update Successfully`,
      });
      return navigate("/");
    }
  }
  return (
    <div className="profile-container">
      <div className="hidden md:flex max-w-5xl w-full">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="shad-button_ghost"
        >
          <img
            src={"/assets/icons/back.svg"}
            alt="back"
            width={24}
            height={24}
          />
          <p className="small-medium lg:base-medium">Back</p>
        </Button>
      </div>

      <div className="profile-inner_container">
        <div className="flex-center lg:h-40 lg:w-40 h-0 w-0 ">
          <img
            src={user.imageURL}
            alt="logo"
            className="h-28 w-28 rounded-full hidden lg:block"
          />
        </div>

        <div className=" mb-10">
          <div className="flex flex-row gap-3">
            <h3 className="h2-bold">{user.name}</h3>
            <p className="small-regular mt-3 text-light-3">@{user.username}</p>
          </div>

          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-9 w-full  max-w-5xl"
              >
                <FormField
                  control={form.control}
                  name="file"
                  render={({ field }) => (
                    <FormItem className="py-2">
                      <div className="flex flex-1 flex-between">
                        <FormLabel className="h2-bold text-light-3">
                          Change Profile Photo
                        </FormLabel>
                        <img src="/assets/icons/edit.svg" alt="" />
                      </div>
                      <FormControl>
                        <FileUploader
                          fieldChange={field.onChange}
                          mediaURL={user.imageURL}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel className="shad-form_label base-medium">Name</FormLabel>
                      <FormControl>
                        <Input
                          className="shad-input base-medium"
                          placeholder="eg John Doe.."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel className="shad-form_label base-regular">
                        Username
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="shad-input base-medium"
                          placeholder="something unique"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />



<FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel className="shad-form_label base-regular">Email</FormLabel>
                      <FormControl>
                        <Input
                          className="shad-input base-medium"
                          placeholder="abc@gmail.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />



                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel className="shad-form_label base-regular">Add bio</FormLabel>
                      <FormControl>
                        <Input
                          className="shad-input base-medium"
                          placeholder="something about you"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-row items-end justify-end"> 
                <Button
                  className="shad-button_primary profile-tab"
                  type="submit"
                >
                  Update
                </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
