import { supabase } from '../lib/supabase';

export interface JobApplicationInput { jobId:string;jobTitle:string;companyName:string;applicantName:string;applicantPhone:string;applicantEmail:string;coverNote?:string }
export interface ApplicationStatusResult { applied:boolean;status?:string;isOwner?:boolean;error?:string }

export class JobApplicationService {
  static async getApplicationStatus(jobId:string):Promise<ApplicationStatusResult>{
    try {
      const {data:{user}}=await supabase.auth.getUser(); if(!user)return{applied:false};
      const{data:job,error:jobError}=await supabase.from('listings').select('owner_id').eq('id',jobId).maybeSingle();
      if(jobError)return{applied:false,error:jobError.message}; if(job?.owner_id===user.id)return{applied:false,isOwner:true};
      const{data,error}=await supabase.from('job_applications').select('id,status').eq('job_listing_id',jobId).eq('applicant_id',user.id).maybeSingle();
      if(error)return{applied:false,error:error.message}; return data?{applied:true,status:data.status,isOwner:false}:{applied:false,isOwner:false};
    }catch(error){return{applied:false,error:error instanceof Error?error.message:'Application status is unavailable.'}}
  }

  static async submitApplication(input:JobApplicationInput):Promise<{success:boolean;error?:string}>{
    if(!navigator.onLine)return{success:false,error:'You are offline. Connect to the internet before submitting an application.'};
    try{
      const{data:{user}}=await supabase.auth.getUser(); if(!user)return{success:false,error:'Please sign in to submit your job application.'};
      const{data:job,error:jobError}=await supabase.from('listings').select('owner_id').eq('id',input.jobId).maybeSingle();
      if(jobError)return{success:false,error:jobError.message}; if(job?.owner_id===user.id)return{success:false,error:'You cannot apply to your own job listing.'};
      const{error}=await supabase.from('job_applications').insert({job_listing_id:input.jobId,applicant_id:user.id,applicant_name:input.applicantName,contact_phone:input.applicantPhone,contact_email:input.applicantEmail,cover_note:input.coverNote||null,status:'submitted'});
      if(error)return{success:false,error:error.code==='23505'?'You have already applied for this position.':error.message}; return{success:true};
    }catch(error){return{success:false,error:error instanceof Error?error.message:'Failed to submit application.'}}
  }
}
