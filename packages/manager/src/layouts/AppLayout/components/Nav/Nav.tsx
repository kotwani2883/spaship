import Router from 'next/router';
import { signOut, useSession } from 'next-auth/react';

import {
  Avatar,
  Button,
  ButtonVariant,
  Flex,
  FlexItem,
  Masthead,
  MastheadBrand,
  MastheadContent,
  MastheadMain,
  Popover,
  Text,
  Title,
  TitleSizes,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  NotificationDrawer,
  NotificationDrawerBody,
  NotificationDrawerHeader,
  NotificationDrawerList,
  NotificationDrawerListItem,
  NotificationDrawerListItemBody,
  NotificationDrawerListItemHeader,
  NotificationBadge,
  Badge
} from '@patternfly/react-core';
import { BellIcon } from '@patternfly/react-icons';
import { env } from '@app/config/env';
import { useToggle } from '@app/hooks';
import { pageLinks } from '@app/links';
import { deleteOrchestratorAuthorizationHeader } from '@app/config/orchestratorReq';
import { useEffect, useState } from 'react';
import { useGetDocumentPage } from '@app/services/documents';

export const Nav = () => {
  const { data: session } = useSession();
  const [isSigningOut, setIsSigningOut] = useToggle();
  const [notificationCount, setNotificationCount] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // state to control the Notification Drawer
  const dataForNotifications = useGetDocumentPage();
  const bannerNotifications = dataForNotifications?.data?.banner ?? [];
  const bannerNotificationCount = bannerNotifications.length;
  console.log(bannerNotifications)
  const onSignOut = () => {
    setIsSigningOut.on();
    signOut({ redirect: false, callbackUrl: pageLinks.loginPage })
      .then((data) => {
        deleteOrchestratorAuthorizationHeader();
        Router.push(data.url);
      })
      .catch(() => {
        setIsSigningOut.off();
      });
  };
  const handleNotificationClick = () => {
    // TODO: Handle notification click
    setNotificationCount(notificationCount - bannerNotificationCount);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const handleBellIconClick = () => {
    setIsDrawerOpen(!isDrawerOpen);
    setNotificationCount(0);
  };


  useEffect(() => {
    setNotificationCount(bannerNotifications.length);
  }, [bannerNotifications]);

  return (
    <Masthead backgroundColor="dark" style={{ padding: 0 }}>
      <MastheadMain className="logo" style={{ width: '256px' }}>
        <MastheadBrand className="pf-u-ml-lg">
          <img src="/img/spaship-logo-light.svg" alt="SPASHIP" style={{ height: '32px' }} />
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent>
        <Toolbar id="toolbar" isFullHeight isStatic>
          <ToolbarContent>
            <ToolbarGroup
              variant="icon-button-group"
              alignment={{ default: 'alignRight' }}
              spacer={{ default: 'spacerNone', md: 'spacerMd' }}
              spaceItems={{ default: 'spaceItemsSm' }}
            >
              <ToolbarItem>
                <Button
                  component="a"
                  aria-label="DOC URL"
                  variant={ButtonVariant.link}
                  style={{ color: '#fff' }}
                  href={env.PUBLIC_DOC_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Go to Docs
                </Button>
              </ToolbarItem>
              <ToolbarItem>
              <div style={{ position: 'relative', display: 'inline-block',marginRight:'10px' }}>
      <BellIcon onClick={handleBellIconClick} />
      {notificationCount > 0 && (
        <Badge
          isRead={false}
          style={{
            position: 'absolute',
            top: '-10px',
            right: '-10px',
            fontSize: '11px',
            minWidth: '16px',
            height: '17px',
            borderRadius: '9px',
            padding: '2px 4px',
            backgroundColor: '#f0ab00',
            color: 'black',
            textAlign: 'center',
            fontWeight:'bolder'
          }}
        >
          {notificationCount}
        </Badge>
      )}
        {isDrawerOpen && (
         <NotificationDrawer
         style={{
          position: 'fixed',
        top: 0,
        right: 0,
        height: '100%',
        width: '300px',
        transform: 'translateY(100%)',
        transition: 'transform 0.3s ease-in-out'
        }}
        onClick={() => setIsDrawerOpen(false)}
         >
           <NotificationDrawerBody>
             <NotificationDrawerList >
               {bannerNotifications?.map(({ _id, title,  }) => (
                 <NotificationDrawerListItem
                   key={_id}
                   onClick={handleNotificationClick}
                 >
                   <NotificationDrawerListItemHeader
                     title={title}
                     variant="info"
                   />
     
                 </NotificationDrawerListItem>
               ))}
             </NotificationDrawerList>
           </NotificationDrawerBody>
         </NotificationDrawer>
      )}
    </div>
              </ToolbarItem>
              <ToolbarItem>
                <Popover
                  flipBehavior={['bottom-end']}
                  hasAutoWidth
                  showClose={false}
                  bodyContent={
                    <Flex
                      style={{ width: '200px' }}
                      direction={{ default: 'column' }}
                      alignItems={{ default: 'alignItemsCenter' }}
                      spaceItems={{ default: 'spaceItemsSm' }}
                    >
                      <FlexItem>
                        <Avatar src="/img/avatar.svg" alt="Avatar image" size="lg" />
                      </FlexItem>
                      <FlexItem>
                        <Title headingLevel="h6" size={TitleSizes.lg}>
                          {session?.user?.name}
                        </Title>
                      </FlexItem>
                      <FlexItem>
                        <Text component="small">{session?.user?.email}</Text>
                      </FlexItem>
                      <FlexItem className="pf-u-w-100">
                        <Button
                          isBlock
                          isLoading={isSigningOut}
                          isDisabled={isSigningOut}
                          onClick={onSignOut}
                        >
                          Logout
                        </Button>
                      </FlexItem>
                    </Flex>
                  }
                >
                  <Avatar
                    src="/img/avatar.svg"
                    alt="Avatar image"
                    size="md"
                    className="cursor-pointer"
                  />
                </Popover>
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>
      </MastheadContent>
    </Masthead>
  );
};
