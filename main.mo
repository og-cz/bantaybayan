import AccessControl "authorization/access-control";
import Principal "mo:base/Principal";
import OrderedMap "mo:base/OrderedMap";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Debug "mo:base/Debug";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Array "mo:base/Array";
import List "mo:base/List";
import Nat "mo:base/Nat";



actor MunicipalProjectTracker {
  let accessControlState = AccessControl.initState();
  let storage = Storage.new();
  include MixinStorage(storage);

  transient let textMap = OrderedMap.Make<Text>(Text.compare);
  transient let principalMap = OrderedMap.Make<Principal>(Principal.compare);

  var projects = textMap.empty<Project>();
  var districts = textMap.empty<District>();
  var announcements = textMap.empty<Announcement>();
  var userProfiles = principalMap.empty<UserProfile>();
  var comments = textMap.empty<Comment>();
  var notifications = textMap.empty<Notification>();

  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    principalMap.get(userProfiles, caller);
  };

  public query func getUserProfile(user : Principal) : async ?UserProfile {
    principalMap.get(userProfiles, user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userProfiles := principalMap.put(userProfiles, caller, profile);
  };

  public shared ({ caller }) func addProject(project : Project) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add projects");
    };
    projects := textMap.put(projects, project.id, project);
  };

  public shared ({ caller }) func updateProject(project : Project) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update projects");
    };
    projects := textMap.put(projects, project.id, project);
  };

  public query func getProject(id : Text) : async ?Project {
    textMap.get(projects, id);
  };

  public query func getAllProjects() : async [Project] {
    let projectVals = textMap.vals(projects);
    var projectList : [Project] = [];
    for (project in projectVals) {
      projectList := Array.append(projectList, [project]);
    };
    projectList;
  };

  public query func getRecentProjects(limit : Nat) : async [Project] {
    let projectVals = textMap.vals(projects);
    var projectList : [Project] = [];
    for (project in projectVals) {
      projectList := Array.append(projectList, [project]);
    };
    let sortedProjects = Array.sort<Project>(
      projectList,
      func(a : Project, b : Project) : { #less; #equal; #greater } {
        if (a.createdAt > b.createdAt) { #less } else if (a.createdAt < b.createdAt) {
          #greater;
        } else { #equal };
      },
    );
    if (sortedProjects.size() <= limit) {
      sortedProjects;
    } else {
      Array.tabulate<Project>(limit, func(i) { sortedProjects[i] });
    };
  };

  public shared ({ caller }) func addDistrict(district : District) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add districts");
    };
    districts := textMap.put(districts, district.id, district);
  };

  public query func getDistrict(id : Text) : async ?District {
    textMap.get(districts, id);
  };

  public query func getAllDistricts() : async [District] {
    let districtVals = textMap.vals(districts);
    var districtList : [District] = [];
    for (district in districtVals) {
      districtList := Array.append(districtList, [district]);
    };
    districtList;
  };

  public shared ({ caller }) func addAnnouncement(announcement : Announcement) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add announcements");
    };
    announcements := textMap.put(announcements, announcement.id, announcement);
  };

  public query func getAnnouncement(id : Text) : async ?Announcement {
    textMap.get(announcements, id);
  };

  public query func getAllAnnouncements() : async [Announcement] {
    let announcementVals = textMap.vals(announcements);
    var announcementList : [Announcement] = [];
    for (announcement in announcementVals) {
      announcementList := Array.append(announcementList, [announcement]);
    };
    announcementList;
  };

  public shared ({ caller }) func addComment(comment : Comment) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can add comments");
    };
    comments := textMap.put(comments, comment.id, comment);
  };

  public shared ({ caller }) func deleteComment(commentId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can delete comments");
    };
    comments := textMap.remove(comments, commentId).0;
  };

  public query func getCommentsByProject(projectId : Text) : async [Comment] {
    let commentVals = textMap.vals(comments);
    var commentList : [Comment] = [];
    for (comment in commentVals) {
      if (comment.projectId == projectId) {
        commentList := Array.append(commentList, [comment]);
      };
    };
    commentList;
  };

  public shared ({ caller }) func addNotification(notification : Notification) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add notifications");
    };
    notifications := textMap.put(notifications, notification.id, notification);
  };

  public query func getNotificationsByUser(userId : Text) : async [Notification] {
    let notificationVals = textMap.vals(notifications);
    var notificationList : [Notification] = [];
    for (notification in notificationVals) {
      if (notification.userId == userId) {
        notificationList := Array.append(notificationList, [notification]);
      };
    };
    notificationList;
  };

  public shared ({ caller }) func bookmarkProject(projectId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can bookmark projects");
    };

    switch (principalMap.get(userProfiles, caller)) {
      case (?profile) {
        let updatedBookmarks = List.push(projectId, profile.bookmarkedProjects);
        let updatedProfile = {
          profile with
          bookmarkedProjects = updatedBookmarks;
        };
        userProfiles := principalMap.put(userProfiles, caller, updatedProfile);
      };
      case null {
        let newProfile = {
          name = "";
          email = "";
          role = "";
          bookmarkedProjects = List.push(projectId, List.nil());
        };
        userProfiles := principalMap.put(userProfiles, caller, newProfile);
      };
    };
  };

  public shared ({ caller }) func removeBookmark(projectId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can remove bookmarks");
    };

    switch (principalMap.get(userProfiles, caller)) {
      case (?profile) {
        let updatedBookmarks = List.filter<Text>(
          profile.bookmarkedProjects,
          func(id) { id != projectId },
        );
        let updatedProfile = {
          profile with
          bookmarkedProjects = updatedBookmarks;
        };
        userProfiles := principalMap.put(userProfiles, caller, updatedProfile);
      };
      case null {};
    };
  };

  public query ({ caller }) func getBookmarkedProjects() : async [Project] {
    switch (principalMap.get(userProfiles, caller)) {
      case (?profile) {
        var bookmarkedProjects : [Project] = [];
        for (projectId in List.toIter(profile.bookmarkedProjects)) {
          switch (textMap.get(projects, projectId)) {
            case (?project) {
              bookmarkedProjects := Array.append(bookmarkedProjects, [project]);
            };
            case null {};
          };
        };
        bookmarkedProjects;
      };
      case null { [] };
    };
  };

  public shared func adminLogin(username : Text, password : Text) : async Bool {
    if (username == "admin" and password == "1234") {
      true;
    } else {
      false;
    };
  };

  public type Project = {
    id : Text;
    name : Text;
    description : Text;
    municipality : Text;
    district : Text;
    category : Text;
    startDate : Time.Time;
    endDate : Time.Time;
    progress : Float;
    status : ProjectStatus;
    officialInCharge : Text;
    milestones : [Milestone];
    attachments : [Text];
    createdAt : Time.Time;
    updatedAt : Time.Time;
    budget : Budget;
    thumbnail : ?Text;
  };

  public type ProjectStatus = {
    #planned;
    #active;
    #completed;
  };

  public type Milestone = {
    name : Text;
    description : Text;
    targetDate : Time.Time;
    completed : Bool;
  };

  public type Budget = {
    total : Float;
    breakdown : [BudgetItem];
  };

  public type BudgetItem = {
    category : Text;
    amount : Float;
  };

  public type District = {
    id : Text;
    name : Text;
    projects : [Text];
    activeProjects : Nat;
    completedProjects : Nat;
    coverImage : ?Text;
    logo : ?Text;
    budgetSummary : BudgetSummary;
    overview : Text;
    barangays : [Barangay];
  };

  public type Barangay = {
    name : Text;
    landmarkNotes : Text;
  };

  public type BudgetSummary = {
    totalBudget : Float;
    spent : Float;
    remaining : Float;
  };

  public type Announcement = {
    id : Text;
    title : Text;
    content : Text;
    date : Time.Time;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    role : Text;
    bookmarkedProjects : List.List<Text>;
  };

  public type Comment = {
    id : Text;
    projectId : Text;
    userId : Text;
    content : Text;
    timestamp : Time.Time;
    replies : [Comment];
    status : CommentStatus;
  };

  public type CommentStatus = {
    #active;
    #reported;
    #deleted;
  };

  public type Notification = {
    id : Text;
    userId : Text;
    content : Text;
    timestamp : Time.Time;
    read : Bool;
    type_ : NotificationType;
  };

  public type NotificationType = {
    #projectUpdate;
    #commentReply;
    #announcement;
  };
};

