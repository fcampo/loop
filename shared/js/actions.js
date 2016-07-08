/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

var loop = loop || {};
loop.shared = loop.shared || {};
loop.shared.actions = (function() {
  "use strict";

  /**
   * Actions are events that are triggered by the user, e.g. clicking a button,
   * or by an async event, e.g. status received.
   *
   * They should be dispatched to stores via the dispatcher.
   *
   * @note  "name" in the ActionData is overwritten with the name
   *        of the action itself, meaning that using your own parameter
   *        called "name" will make things go sideways.  XXX we should
   *        make this harder to trip on or disappear.
  */
  function Action(name, schema, values) {
    var validatedData = new loop.validate.Validator(schema || {})
                                         .validate(values || {});
    Object.keys(validatedData).forEach(function(prop) {
      this[prop] = validatedData[prop];
    }.bind(this));

    this.name = name;
  }

  Action.define = function(name, schema) {
    return Action.bind(null, name, schema);
  };

  return {
    Action: Action,

    /**
     * Get the window data for the provided window id
     */
    GetWindowData: Action.define("getWindowData", {
      windowId: String
    }),

    /**
     * Extract the token information and type for the standalone window
     */
    ExtractTokenInfo: Action.define("extractTokenInfo", {
      windowPath: String,
      windowHash: String
    }),

    /**
     * Used to pass round the window data so that stores can
     * record the appropriate data.
     */
    SetupWindowData: Action.define("setupWindowData", {
      roomToken: String
    }),

    /**
     * Used to fetch the data from the server for a room or call for the
     * token.
     */
    FetchServerData: Action.define("fetchServerData", {
      // cryptoKey: String - Optional.
      token: String,
      windowType: String
    }),

    /**
     * Used to signal when the window is being unloaded.
     */
    WindowUnload: Action.define("windowUnload", {
    }),

    /**
     * Used to indicate the remote peer was disconnected for some reason.
     *
     * peerHungup is true if the peer intentionally disconnected, false otherwise.
     */
    RemotePeerDisconnected: Action.define("remotePeerDisconnected", {
      peerHungup: Boolean
    }),

    /**
     * Used for notifying of connection failures.
     */
    ConnectionFailure: Action.define("connectionFailure", {
      // A string relating to the reason the connection failed.
      reason: String
    }),

    /**
     * Used to notify that the sdk session is now connected to the servers.
     */
    ConnectedToSdkServers: Action.define("connectedToSdkServers", {
    }),

    /**
     * Used to notify that a remote peer has connected to the room.
     */
    RemotePeerConnected: Action.define("remotePeerConnected", {
    }),

    /**
     * Used to notify that the session has a data channel available.
     */
    DataChannelsAvailable: Action.define("dataChannelsAvailable", {
      available: Boolean
    }),

    /**
     * Used to send a message to the other peer.
     */
    SendTextChatMessage: Action.define("sendTextChatMessage", {
      contentType: String,
      message: String,
      sentTimestamp: Number
    }),

    /**
     * Notifies that a message has been received from the other peer.
     */
    ReceivedTextChatMessage: Action.define("receivedTextChatMessage", {
      contentType: String,
      message: String,
      // XXX (optional because we don't use this for tiles.  Should refactor)
      // displayName: String,
      receivedTimestamp: Number
      // sentTimestamp: Number (optional)
    }),

    /**
     * Display name to be used identifying this user
     */
     SetOwnDisplayName: Action.define("setOwnDisplayName", {
       displayName: String
     }),

    /**
     * Notifies that participant data has been received.
     */
    UpdatedParticipant: Action.define("updatedParticipant", {
      participantName: String,
      // This id was originally provided by loop-server on getting room data.
      userId: String
    }),

    /**
     * Notifies that presence data has been received.
     */
    UpdatedPresence: Action.define("updatedPresence", {
      isHere: Boolean,
      pingedAgo: Number,
      // This id was originally provided by loop-server on getting room data.
      userId: String
    }),

    /**
     * Used to add a page to the current room
     */
     // XXX akita: Update actions when metadata extraction bug is landed (Bug 1273497)
    AddPage: Action.define("addPage", {
      title: String,
      thumbnail_img: String,
      url: String
    }),

    /**
     * Notifies that a tile has been received from the other peer.
     */
    // XXX akita rename for readability
    AddedPage: Action.define("addedPage", {
      pageId: String,
      added_by: String,
      added_time: Number,
      metadata: Object
      // {
      //   title: String,
      //   thumbnail_img: String,
      //   url: String
      // }
    }),

    /**
     * Used to delete a page of the current room
     */
    DeletePage: Action.define("deletePage", {
      pageId: String
    }),

    /**
    * Notifies that a tile has been removed.
     */
    // XXX akita rename for readability
    DeletedPage: Action.define("deletedPage", {
      pageId: String,
      added_by: String,
      added_time: Number,
      metadata: Object,
      // {
      //   title: String,
      //   thumbnail_img: String,
      //   url: String
      // }
      deleted: Object
      // {
      //   deleted_by: String
      //   deletion_time: Number
      // }
    }),

    /**
     * Update a page with newly obtained metadata information.
     */
    UpdatePage: Action.define("updatePage", {
      thumbnail_img: String,
      title: String,
      pageId: String
    }),

    /**
     *  Used to send cursor data to the other peer
     */
    SendCursorData: Action.define("sendCursorData", {
      // ratioX: Number (optional)
      // ratioY: Number (optional)
      type: String
    }),

    /**
     * Notifies that cursor data has been received from the other peer.
     */
    ReceivedCursorData: Action.define("receivedCursorData", {
      // ratioX: Number (optional)
      // ratioY: Number (optional)
      type: String
    }),

    /**
     * Used by the ongoing views to notify stores about the elements
     * required for the sdk.
     */
    SetupStreamElements: Action.define("setupStreamElements", {
      // The configuration for the publisher/subscribe options
      publisherConfig: Object
    }),

    /**
     * Used for notifying that a waiting tile was shown.
     */
    TileShown: Action.define("tileShown", {
    }),

    /**
     * Used for notifying that local media has been obtained.
     */
    GotMediaPermission: Action.define("gotMediaPermission", {
    }),

    /**
     * Used for notifying that the media is now up for the call.
     */
    MediaConnected: Action.define("mediaConnected", {
    }),

    /**
     * Used for notifying that the dimensions of a stream just changed. Also
     * dispatched when a stream connects for the first time.
     */
    VideoDimensionsChanged: Action.define("videoDimensionsChanged", {
      isLocal: Boolean,
      videoType: String,
      dimensions: Object
    }),

    /**
     * Used for notifying that the hasVideo property of the screen stream, has changed.
     */
    VideoScreenStreamChanged: Action.define("videoScreenStreamChanged", {
      hasVideo: Boolean
    }),

    /**
     * A stream from local or remote media has been created.
     */
    MediaStreamCreated: Action.define("mediaStreamCreated", {
      hasAudio: Boolean,
      hasVideo: Boolean,
      isLocal: Boolean,
      srcMediaElement: Object
    }),

    /**
     * A stream from local or remote media has been destroyed.
     */
    MediaStreamDestroyed: Action.define("mediaStreamDestroyed", {
      isLocal: Boolean
    }),

    /**
     * Used to inform that the remote stream has enabled or disabled the video
     * part of the stream.
     *
     * @note We'll may want to include the future the reason provided by the SDK
     *       and documented here:
     *       https://tokbox.com/opentok/libraries/client/js/reference/VideoEnabledChangedEvent.html
     */
    RemoteVideoStatus: Action.define("remoteVideoStatus", {
      videoEnabled: Boolean
    }),

    /**
     * Used to mute or unmute a stream
     */
    SetMute: Action.define("setMute", {
      // The part of the stream to enable, e.g. "audio" or "video"
      type: String,
      // Whether or not to enable the stream.
      enabled: Boolean
    }),

    /**
     * Used to start a browser tab share.
     */
    StartBrowserShare: Action.define("startBrowserShare", {
    }),

    /**
     * Used to end a screen share.
     */
    EndScreenShare: Action.define("endScreenShare", {
    }),

    /**
     * Used to mute or unmute a screen share.
     */
    ToggleBrowserSharing: Action.define("toggleBrowserSharing", {
      // Whether or not to enable the stream.
      enabled: Boolean
    }),

    /**
     * Used to notify that screen sharing is active or not.
     */
    ScreenSharingState: Action.define("screenSharingState", {
      // One of loop.shared.utils.SCREEN_SHARE_STATES.
      state: String
    }),

    /**
     * Used to notify that a shared screen is being received (or not).
     *
     * XXX this should be split into multiple actions to make the code clearer.
     */
    ReceivingScreenShare: Action.define("receivingScreenShare", {
      receiving: Boolean
      // srcMediaElement: Object (only present if receiving is true)
    }),

    /**
     * Creates a new room.
     * XXX: should move to some roomActions module - refs bug 1079284
     */
    CreateRoom: Action.define("createRoom", {
      // See https://wiki.mozilla.org/Loop/Architecture/Context#Format_of_context.value
      // urls: Object - Optional
    }),

    /**
     * When a room has been created.
     * XXX: should move to some roomActions module - refs bug 1079284
     */
    CreatedRoom: Action.define("createdRoom", {
      decryptedContext: Object,
      roomToken: String,
      roomUrl: String
    }),

    /**
     * Rooms creation error.
     * XXX: should move to some roomActions module - refs bug 1079284
     */
    CreateRoomError: Action.define("createRoomError", {
      // There's two types of error possible - one thrown by our code (and Error)
      // and the other is an Object about the error codes from the server as
      // returned by the Hawk request.
      error: Object
    }),

    /**
     * Deletes a room.
     * XXX: should move to some roomActions module - refs bug 1079284
     */
    DeleteRoom: Action.define("deleteRoom", {
      roomToken: String
    }),

    /**
     * Room deletion error.
     * XXX: should move to some roomActions module - refs bug 1079284
     */
    DeleteRoomError: Action.define("deleteRoomError", {
      // There's two types of error possible - one thrown by our code (and Error)
      // and the other is an Object about the error codes from the server as
      // returned by the Hawk request.
      error: Object
    }),

    /**
     * Retrieves room list.
     * XXX: should move to some roomActions module - refs bug 1079284
     */
    GetAllRooms: Action.define("getAllRooms", {
    }),

    /**
     * An error occured while trying to fetch the room list.
     * XXX: should move to some roomActions module - refs bug 1079284
     */
    GetAllRoomsError: Action.define("getAllRoomsError", {
      // There's two types of error possible - one thrown by our code (and Error)
      // and the other is an Object about the error codes from the server as
      // returned by the Hawk request.
      error: [Error, Object]
    }),

    /**
     * Updates room list.
     * XXX: should move to some roomActions module - refs bug 1079284
     */
    UpdateRoomList: Action.define("updateRoomList", {
      roomList: Array
    }),

    /**
     * Opens a room.
     * XXX: should move to some roomActions module - refs bug 1079284
     */
    OpenRoom: Action.define("openRoom", {
      roomToken: String
    }),

    /**
     * Updates the context data attached to a room.
     * XXX: should move to some roomActions module - refs bug 1079284
     */
    UpdateRoomContext: Action.define("updateRoomContext", {
      roomToken: String
      // newRoomName: String, Optional.
      // newRoomDescription: String, Optional.
      // newRoomThumbnail: String, Optional.
      // newRoomURL: String Optional.
      // sentTimestamp: Number, Optional.
    }),

    /**
     * Updating the context data attached to a room error.
     */
    UpdateRoomContextError: Action.define("updateRoomContextError", {
      error: [Error, Object]
    }),

    /**
     * Updating the context data attached to a room finished successfully.
     */
    UpdateRoomContextDone: Action.define("updateRoomContextDone", {
    }),

    /**
     * Copy a room url into the user's clipboard.
     * XXX: should move to some roomActions module - refs bug 1079284
     * @from: where the invitation is shared from.
     *        Possible values ['panel', 'conversation']
     * @roomUrl: the URL that is shared
     */
    CopyRoomUrl: Action.define("copyRoomUrl", {
      from: String,
      roomUrl: String
    }),

    /**
     * Email a room url.
     * XXX: should move to some roomActions module - refs bug 1079284
     * @from: where the invitation is shared from.
     *        Possible values ['panel', 'conversation']
     * @roomUrl: the URL that is shared
     */
    EmailRoomUrl: Action.define("emailRoomUrl", {
      from: String,
      roomUrl: String
      // roomDescription: String, Optional.
    }),

    /**
     * Share a room url with Facebook.
     * XXX: should move to some roomActions module - refs bug 1079284
     * @from: where the invitation is shared from.
     *        Possible values ['panel', 'conversation']
     * @roomUrl: the URL that is shared.
     * @roomOrigin: the URL browsed when the sharing is started - Optional.
     */
    FacebookShareRoomUrl: Action.define("facebookShareRoomUrl", {
      from: String,
      roomUrl: String
      // roomOrigin: String
    }),

    /**
     * XXX: should move to some roomActions module - refs bug 1079284
     */
    RoomFailure: Action.define("roomFailure", {
      error: Object,
      // XXX akita - Decide if this is still useful or not.
      // True when the failures occurs in the join room request to the loop-server.
      failedJoinRequest: Boolean
    }),

    /**
     * Updates the room information when it is received.
     * XXX: should move to some roomActions module - refs bug 1079284
     *
     * @see https://wiki.mozilla.org/Loop/Architecture/Rooms#GET_.2Frooms.2F.7Btoken.7D
     */
    UpdateRoomInfo: Action.define("updateRoomInfo", {
      // participants: Array - Optional.
      // roomContextUrls: Array - Optional.
      // See https://wiki.mozilla.org/Loop/Architecture/Context#Format_of_context.value
      // roomInfoFailure: String - Optional.
      // roomName: String - Optional.
      // roomState: String - Optional.
      roomUrl: String
    }),

    /**
     * Notifies if the user agent will handle the room or not.
     */
    UserAgentHandlesRoom: Action.define("userAgentHandlesRoom", {
      handlesRoom: Boolean
    }),

    UpdateUserAgentRoomState: Action.define("updateUserAgentRoomState", {
      status: String
    }),

    /**
     * Opens a room via the user agent chrome, e.g. Firefox.
     */
    OpenUserAgentRoom: Action.define("openUserAgentRoom", {
    }),

    /**
     * Starts the process for the user to start the WebRTC connection.
     * XXX: should move to some roomActions module - refs bug 1079284
     */
    InitiateWebRTC: Action.define("initiateWebRTC", {
    }),

    /**
     * A special action for metrics logging to define what type of join
     * occurred when JoinRoom was activated.
     * XXX: should move to some roomActions module - refs bug 1079284
     */
    MetricsLogJoinRoom: Action.define("metricsLogJoinRoom", {
      userAgentHandledRoom: Boolean
      // ownRoom: Boolean - Optional. Expected if firefoxHandledRoom is true.
    }),

    /**
     * Starts the process for the user to join the room.
     * XXX: should move to some roomActions module - refs bug 1079284
     */
    RetryAfterRoomFailure: Action.define("retryAfterRoomFailure", {
    }),

    /**
     * Signals the user has successfully joined the room on the loop-server.
     * XXX: should move to some roomActions module - refs bug 1079284
     *
     * @see https://wiki.mozilla.org/Loop/Architecture/Rooms#Joining_a_Room
     */
    SetupWebRTCTokens: Action.define("setupWebRTCTokens", {
      apiKey: String,
      sessionToken: String,
      sessionId: String
    }),

    /**
     * Used to indicate the user wishes to leave the conversation. This is
     * different to leaving the room, in that we might display the feedback
     * view, or just close the window. Whereas, the leaveRoom action is for
     * the action of leaving an activeRoomStore room.
     */
    LeaveConversation: Action.define("leaveConversation", {
    }),

    /**
     * Used to indicate the user wishes to leave the room.
     */
    LeaveRoom: Action.define("leaveRoom", {
    }),

    /**
     * Signals that the feedback view should be rendered.
     */
    ShowFeedbackForm: Action.define("showFeedbackForm", {
    }),

    /**
     * Used to record a link click for metrics purposes.
     */
    RecordClick: Action.define("recordClick", {
      // Note: for ToS and Privacy links, this should be the link, for
      // other links this should be a generic description so that we don't
      // record what users are clicking, just the information about the fact
      // they clicked the link in that spot (e.g. "Shared URL").
      linkInfo: String
    }),

    /**
     * Used to inform of the current session, publisher and connection
     * status.
     */
    ConnectionStatus: Action.define("connectionStatus", {
      event: String,
      state: String,
      connections: Number,
      sendStreams: Number,
      recvStreams: Number
    }),

    /**
     * Used to show the snackbar.
     */
    ShowSnackbar: Action.define("showSnackbar", {
      label: String
    })
  };
})();
