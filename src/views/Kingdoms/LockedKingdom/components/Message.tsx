import React, { useContext } from "react";
import styled from "styled-components";
import { variant as systemVariant, space } from "styled-system";
import {TextProps, Text} from "@pancakeswap-libs/uikit";

export interface MessageProps {
    variant: Variant;
    action?: React.ReactNode;
    actionInline?: boolean;
    style?: React.CSSProperties;
}

export const variants = {
    WARNING: "warning",
    DANGER: "danger",
    SUCCESS: "success",
} as const;

export type Variant = typeof variants[keyof typeof variants];


const MessageContext = React.createContext<MessageProps>({ variant: "success" });

const MessageContainer = styled.div<MessageProps>`
  background-color: rgba(255, 178, 55, 0.098);
  padding: 16px;
  border-radius: 16px;
  border: #D67E0A solid 2px;

  ${space}
  ${systemVariant({
    variants,
})}
`;

const Flex = styled.div`
  display: flex;
`;

const colors = {
    // these color names should be place in the theme once the palette is finalized
    warning: "#D67E0A",
    success: "#129E7D",
    danger: "failure",
};

export const MessageText: React.FC<React.PropsWithChildren<TextProps>> = ({ children, ...props }) => {
    const ctx = useContext(MessageContext);
    return (
        <Text fontSize="14px" color={colors[ctx?.variant]} {...props}>
            {children}
        </Text>
    );
};

const Message: React.FC<React.PropsWithChildren<MessageProps>> = ({
                                                                      children,
                                                                      variant,
                                                                      action,
                                                                      actionInline,
                                                                      ...props
                                                                  }) => {
    return (
        <MessageContext.Provider value={{ variant }}>
            <MessageContainer variant={variant} style={{width: "100%", flex: "100%", flexGrow: 1}} {...props}>
                <Flex>
                    {children}
                    {actionInline && action}
                </Flex>
                {!actionInline && action}
            </MessageContainer>
        </MessageContext.Provider>
    );
};

export default Message;
