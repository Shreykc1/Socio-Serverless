import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { updateProfile } from "@/lib/appwrite/api";
import { toast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ProfileValidation } from "@/lib/validation";
import FileUploader from "@/components/forms/FileUploader";
import { useUpdateProfile } from "@/lib/react-query/queriesandmutations";
import UpdateProfile from "./UpdateProfile";
import { IUpdateProfile, IUser } from "@/types";
import { useState } from "react";

let U: IUser;
let Values: IUpdateProfile;
const Profile = () => {
  const { user } = useUserContext();

  U = user;
  const navigate = useNavigate();
  const { mutateAsync: updateProfile, isPending: isLoadingUpdate } =
    useUpdateProfile();


  // 1. Define your form.
  const form = useForm<z.infer<typeof ProfileValidation>>({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      file: [],
      bio: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof ProfileValidation>) {
    console.log(U);
    console.log("VAALLLS", values);
    const updatedProfile = await updateProfile({
      ...values,
      values: values,
      user: U,
    });

    if (!updatedProfile) {
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
    <div className="post_details-container">
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

      <div className="post_details-card">
        <div className="flex-center h-40 w-40">
          <img
            src={user.imageURL}
            alt="logo"
            className="h-28 w-28 rounded-full"
          />
        </div>

        <div className="post_details-info">
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

                  { !user.bio ? 
                  
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel className="shad-form_label">
                          Add bio
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="shad-input"
                            placeholder="something about you"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />  : 
                  
                    <div className="flex flex-col gap-3">
                        <h3 className="h2-bold text-light-4">Bio</h3>
                        <p className="base-regular text-light-2">{user.bio}</p>
                    </div>

                  }

                <Button className="shad-button_secondary" variant={"secondary"} type="submit">
                  Submit
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
