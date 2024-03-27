import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { map, Observable } from 'rxjs'
import { Comment, Post, User } from '../index/index.component'

export class Paginate<T> {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number
  nextPage: number
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loginUrl = 'http://localhost:3000/auth/signin'
  private registerUrl = 'http://localhost:3000/auth/signup'
  private indexUrl = 'http://localhost:3000/post'
  private commentUrl = 'http://localhost:3000/comment'
  private profileUrl = 'http://localhost:3000/users/me/profile'
  private likeUrl = 'http://localhost:3000/users/like'
  private unlikeUrl = 'http://localhost:3000/users/unlike'
  private usersUrl = 'http://localhost:3000/users'
  private userPostsUrl = 'http://localhost:3000/post/user'
  private followUrl = 'http://localhost:3000/users/follow'
  private unfollowUrl = 'http://localhost:3000/users/unfollow'

  constructor(private http: HttpClient) {}

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(this.loginUrl, credentials)
  }

  register(formData: FormData): Observable<any> {
    return this.http.post(this.registerUrl, formData)
  }

  index(): Observable<Paginate<Post>> {
    return this.http.get<Paginate<Post>>(this.indexUrl).pipe(
      map((res) => ({
        docs: res.docs,
        totalDocs: res.totalDocs,
        limit: res.limit,
        totalPages: res.totalPages,
        page: res.page,
        pagingCounter: res.pagingCounter,
        hasPrevPage: res.hasPrevPage,
        hasNextPage: res.hasNextPage,
        prevPage: res.prevPage,
        nextPage: res.nextPage,
      })),
    )
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.usersUrl}/${id}`)
  }

  details(id: string): Observable<Post> {
    return this.http.get<Post>(`${this.indexUrl}/${id}`)
  }

  addComment(userId: string, postId: string, content: string): Observable<any> {
    return this.http.post(this.commentUrl, {
      userId,
      postId,
      content,
    })
  }

  follow(userId: string, userToFollowId: string): Observable<any> {
    return this.http.post(this.followUrl, { userId, userToFollowId })
  }

  unfollow(userId: string, userToUnfollowId: string): Observable<any> {
    return this.http.post(this.unfollowUrl, { userId, userToUnfollowId })
  }

  getComments(postId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.indexUrl}/${postId}/comments`)
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(this.profileUrl)
  }

  deleteComment(commentId: string): Observable<any> {
    return this.http.delete(`${this.commentUrl}/${commentId}`)
  }

  like(postId: string, userId: string): Observable<any> {
    return this.http.post(this.likeUrl, { postId, userId })
  }

  unlike(postId: string, userId: string): Observable<any> {
    return this.http.post(this.unlikeUrl, { postId, userId })
  }

  getFollowing(userId: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.usersUrl}/${userId}/following`)
  }

  getUserPosts(userId: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.userPostsUrl}/${userId}`)
  }
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl)
  }
}
