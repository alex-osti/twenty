import { useActionMenu } from '@/action-menu/hooks/useActionMenu';
import { ActionMenuComponentInstanceContext } from '@/action-menu/states/contexts/ActionMenuComponentInstanceContext';
import { isCommandMenuOpenedState } from '@/command-menu/states/isCommandMenuOpenedState';
import { contextStoreNumberOfSelectedRecordsComponentState } from '@/context-store/states/contextStoreNumberOfSelectedRecordsComponentState';
import { isDropdownOpenComponentState } from '@/ui/layout/dropdown/states/isDropdownOpenComponentState';
import { useRightDrawer } from '@/ui/layout/right-drawer/hooks/useRightDrawer';
import { useAvailableComponentInstanceIdOrThrow } from '@/ui/utilities/state/component-state/hooks/useAvailableComponentInstanceIdOrThrow';
import { useRecoilComponentValueV2 } from '@/ui/utilities/state/component-state/hooks/useRecoilComponentValueV2';
import { extractComponentState } from '@/ui/utilities/state/component-state/utils/extractComponentState';
import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';

export const RecordIndexActionMenuEffect = () => {
  const contextStoreNumberOfSelectedRecords = useRecoilComponentValueV2(
    contextStoreNumberOfSelectedRecordsComponentState,
  );

  const actionMenuId = useAvailableComponentInstanceIdOrThrow(
    ActionMenuComponentInstanceContext,
  );

  const { openActionBar, closeActionBar } = useActionMenu(actionMenuId);

  const isDropdownOpen = useRecoilValue(
    extractComponentState(
      isDropdownOpenComponentState,
      `action-menu-dropdown-${actionMenuId}`,
    ),
  );
  const { isRightDrawerOpen } = useRightDrawer();

  const isCommandMenuOpened = useRecoilValue(isCommandMenuOpenedState);

  useEffect(() => {
    if (contextStoreNumberOfSelectedRecords > 0 && !isDropdownOpen) {
      // We only handle opening the ActionMenuBar here, not the Dropdown.
      // The Dropdown is already managed by sync handlers for events like
      // right-click to open and click outside to close.
      openActionBar();
    }
    if (contextStoreNumberOfSelectedRecords === 0 && isDropdownOpen) {
      closeActionBar();
    }
  }, [
    contextStoreNumberOfSelectedRecords,
    openActionBar,
    closeActionBar,
    isDropdownOpen,
  ]);

  useEffect(() => {
    if (isRightDrawerOpen || isCommandMenuOpened) {
      closeActionBar();
    }
  }, [closeActionBar, isRightDrawerOpen, isCommandMenuOpened]);

  return null;
};
