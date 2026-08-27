import { supabase } from '../lib/supabase';

export type ReportStatus = 'submitted' | 'under_review' | 'resolved' | 'dismissed';
export type ReviewStatus = 'pending_moderation' | 'published' | 'removed';
export interface AdminReport { id:string;reporterId:string|null;reporterName:string;targetType:string;targetId:string|null;targetModule:string;targetTitle:string;targetSnapshot:string;reasonCode:string;reasonLabel:string;details:string;status:ReportStatus;assignedTo:string|null;resolutionOutcome:string|null;userFacingMessage:string|null;createdAt:string;updatedAt:string;notes:{id:string;note:string;actorId:string;createdAt:string}[];history:{id:string;action:string;details:string;actorName:string;createdAt:string}[] }
export interface AdminReview { id:string;listingId:string;authorId:string;authorName:string;listingTitle:string;module:string;rating:number;body:string;status:ReviewStatus;moderationReason:string|null;createdAt:string }
export interface PageResult<T> { rows:T[];total:number;counts:Record<string,number>;error?:string }
type DbRow=Record<string,unknown>;
const clean=(value:string)=>value.replace(/[,%().]/g,' ').trim();
const tally=(rows:{status:string}[])=>rows.reduce<Record<string,number>>((result,row)=>{result.total=(result.total||0)+1;result[row.status]=(result[row.status]||0)+1;return result},{});

export class AdminModerationService {
  static async reports(filters:{search?:string;status?:string;targetType?:string;module?:string;reason?:string;assignee?:string;dateFrom?:string;dateTo?:string;page:number;pageSize:number}):Promise<PageResult<AdminReport>> {
    let query=supabase.from('reports').select('*',{count:'exact'}).order('created_at',{ascending:false}).range((filters.page-1)*filters.pageSize,filters.page*filters.pageSize-1);
    if(filters.status&&filters.status!=='all')query=query.eq('status',filters.status);
    if(filters.targetType&&filters.targetType!=='all')query=query.eq('target_type',filters.targetType);
    if(filters.module&&filters.module!=='all')query=query.eq('target_module',filters.module);
    if(filters.reason&&filters.reason!=='all')query=query.eq('reason_code',filters.reason);
    if(filters.assignee==='mine'){const{data}=await supabase.auth.getUser();if(!data.user)return{rows:[],total:0,counts:{},error:'Your staff session has expired.'};query=query.eq('assigned_to',data.user.id)}
    if(filters.dateFrom)query=query.gte('created_at',filters.dateFrom);if(filters.dateTo)query=query.lte('created_at',`${filters.dateTo}T23:59:59.999Z`);
    const search=clean(filters.search||'');if(search)query=query.or(`target_title.ilike.%${search}%,details.ilike.%${search}%,reason_label.ilike.%${search}%`);
    const{data,error,count}=await query;if(error)return{rows:[],total:0,counts:{},error:error.message};const raw=(data||[])as DbRow[];
    const ids=(key:string)=>[...new Set(raw.map(row=>row[key]as string|null).filter((id):id is string=>Boolean(id)))];
    const reportIds=ids('id'),reporterIds=ids('reporter_id'),listingIds=ids('listing_id'),reviewIds=ids('review_id'),userIds=ids('target_user_id');
    const[profileRes,noteRes,historyRes,listingRes,reviewRes,targetRes,statusRes]=await Promise.all([
      reporterIds.length?supabase.from('profiles').select('id,full_name').in('id',reporterIds):Promise.resolve({data:[]}),
      reportIds.length?supabase.from('report_internal_notes').select('id,report_id,actor_id,note,created_at').in('report_id',reportIds).order('created_at'):Promise.resolve({data:[]}),
      reportIds.length?supabase.from('audit_logs').select('id,target_id,action,details,actor_name,created_at').eq('target_type','report').in('target_id',reportIds).order('created_at'):Promise.resolve({data:[]}),
      listingIds.length?supabase.from('listings').select('id,title,module,status').in('id',listingIds):Promise.resolve({data:[]}),
      reviewIds.length?supabase.from('reviews').select('id,rating,body,status').in('id',reviewIds):Promise.resolve({data:[]}),
      userIds.length?supabase.from('profiles').select('id,full_name,account_status').in('id',userIds):Promise.resolve({data:[]}),supabase.from('reports').select('status')]);
    const map=(rows:DbRow[]|null)=>new Map((rows||[]).map(row=>[row.id as string,row]));const profiles=map(profileRes.data),listings=map(listingRes.data),reviews=map(reviewRes.data),targets=map(targetRes.data),notes=noteRes.data||[],history=historyRes.data||[];
    return{total:count||0,counts:tally((statusRes.data||[])as{status:string}[]),rows:raw.map(row=>{const listing=listings.get(row.listing_id as string),review=reviews.get(row.review_id as string),targetUser=targets.get(row.target_user_id as string);const targetId=(row.listing_id||row.review_id||row.target_user_id||row.message_id||null)as string|null;return{
      id:row.id as string,reporterId:row.reporter_id as string|null,reporterName:row.reporter_id?(profiles.get(row.reporter_id as string)?.full_name as string||'Reporter'):'Anonymous reporter',targetType:row.target_type as string,targetId,targetModule:(row.target_module as string)||'general',targetTitle:(listing?.title as string)||(row.target_title as string)||'Reported target',
      targetSnapshot:listing?`${listing.title} · ${listing.module} · ${listing.status}`:review?`${review.rating}/5 · ${review.status} · ${review.body}`:targetUser?`${targetUser.full_name||'User'} · ${targetUser.account_status}`:targetId?'Live target details unavailable':'Target unavailable',reasonCode:row.reason_code as string,reasonLabel:row.reason_label as string,details:(row.details as string)||'',status:row.status as ReportStatus,assignedTo:row.assigned_to as string|null,resolutionOutcome:row.resolution_outcome as string|null,userFacingMessage:row.user_facing_message as string|null,createdAt:row.created_at as string,updatedAt:row.updated_at as string,
      notes:notes.filter(note=>note.report_id===row.id).map(note=>({id:note.id,note:note.note,actorId:note.actor_id,createdAt:note.created_at})),history:history.filter(item=>item.target_id===row.id).map(item=>({id:item.id,action:item.action,details:item.details||'',actorName:item.actor_name,createdAt:item.created_at}))}})};
  }
  static async moderateReport(id:string,action:string,values:{note?:string;assignee?:string;outcome?:string;userMessage?:string;linkedAction?:string}={}):Promise<void>{const{error}=await supabase.rpc('admin_moderate_report',{p_report_id:id,p_action:action,p_note:values.note||null,p_assignee:values.assignee||null,p_outcome:values.outcome||null,p_user_message:values.userMessage||null,p_linked_action:values.linkedAction||null});if(error)throw new Error(error.message)}
  static async reviews(filters:{search?:string;status?:string;module?:string;rating?:string;page:number;pageSize:number}):Promise<PageResult<AdminReview>>{
    let query=supabase.from('reviews').select('*,listings!inner(title,module),profiles!reviews_author_id_fkey(full_name)',{count:'exact'}).order('created_at',{ascending:false}).range((filters.page-1)*filters.pageSize,filters.page*filters.pageSize-1);
    if(filters.status&&filters.status!=='all')query=query.eq('status',filters.status);if(filters.module&&filters.module!=='all')query=query.eq('listings.module',filters.module);if(filters.rating&&filters.rating!=='all')query=query.eq('rating',Number(filters.rating));const search=clean(filters.search||'');if(search)query=query.ilike('body',`%${search}%`);
    const{data,error,count}=await query;if(error)return{rows:[],total:0,counts:{},error:error.message};const{data:statuses}=await supabase.from('reviews').select('status');return{total:count||0,counts:tally((statuses||[])as{status:string}[]),rows:((data||[])as unknown as(DbRow&{listings:{title:string;module:string};profiles:{full_name:string}})[]).map(row=>({id:row.id as string,listingId:row.listing_id as string,authorId:row.author_id as string,authorName:row.profiles?.full_name||'Reviewer',listingTitle:row.listings?.title||'Deleted listing',module:row.listings?.module||'general',rating:Number(row.rating),body:row.body as string,status:row.status as ReviewStatus,moderationReason:row.moderation_reason as string|null,createdAt:row.created_at as string}))}
  }
  static async moderateReview(id:string,status:ReviewStatus,reason:string):Promise<void>{const{error}=await supabase.rpc('admin_moderate_review',{p_review_id:id,p_status:status,p_reason:reason});if(error)throw new Error(error.message)}
  static subscribe(onChange:()=>void):()=>void{const channel=supabase.channel('admin-moderation-live').on('postgres_changes',{event:'*',schema:'public',table:'reports'},onChange).on('postgres_changes',{event:'*',schema:'public',table:'reviews'},onChange).subscribe();return()=>{void supabase.removeChannel(channel)}}
}
