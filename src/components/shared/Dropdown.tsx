import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReportValidation } from "@/lib/validation";
import { toast } from "../ui/use-toast";
import { useReport } from "@/lib/react-query/queriesandmutations";
import { useNavigate } from "react-router-dom";

type Dropprop = {
  onReportClick: any;
  userID:string;
  postID: string;
};

const DropdownMenuu = ({ onReportClick,userID,postID }: Dropprop) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { mutateAsync : reportPost } = useReport();

  const handleMenuToggle = () => {
    setIsOpen(!isOpen);
  };


  const form = useForm<z.infer<typeof ReportValidation>>({
    resolver: zodResolver(ReportValidation),
  });

  async function onSubmit(data: z.infer<typeof ReportValidation>) {
    if (!data) return;
  
    const reported = await reportPost({
        choice: data.choice,
        userID: userID,
        postID: postID,
      });

      if (reported) {
        toast({
            title: `Post Reported Successfully`,
          });
          return navigate("/");
      } else {
        toast({
            title: `Post Report failed. Please try again.`,
          });
        
      }
  
    
  }

  return (
    <div className="flex flex-col">
      <div className="">
        <Button variant="default" onClick={handleMenuToggle} className="">
          <img src="/assets/icons/three-dots.svg" alt="" className="w-5" />
        </Button>
      </div>

      {isOpen && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {/* <Button variant="default" onClick={handleShowReport}>
              Report
            </Button> */}
          </DropdownMenuTrigger>
          {isOpen ? (
            <DropdownMenuTrigger asChild>
              <Dialog>
                <DialogTrigger className="text-sm font-bold text-red">
                  Report
                </DialogTrigger>

                <DialogContent className="py-14 mr-1 h-1/2 sm:py-20">
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      Select the Reason for reporting the post. Which will be
                      reviewed and later the action will be taken by our
                      moderators.
                    </DialogDescription>
                  </DialogHeader>

                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="w-2/3 space-y-6"
                    >
                      <FormField
                        control={form.control}
                        name="choice"
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Reason" />
                              </SelectTrigger>
                              <SelectContent className="bg-dark-4 flex justify-center">
                                <SelectItem
                                  value="inapp"
                                  className="text-center"
                                >
                                  Inappropriate Content
                                </SelectItem>
                                <SelectItem
                                  value="copywrite"
                                  className="text-center"
                                >
                                  Copywrite Claims
                                </SelectItem>
                                <SelectItem
                                  value="nsfw"
                                  className="text-center"
                                >
                                  NSFW Content
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="shad-button_primary">Submit</Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </DropdownMenuTrigger>
          ) : (
            <></>
          )}
        </DropdownMenu>
      )}
    </div>
  );
};

export default DropdownMenuu;
