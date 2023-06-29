import React from 'react';
import styled from 'styled-components';
import { ButtonText } from '@aragon/ui-components';
import { StyledInput } from '../../../../ui-components/src/components/input/textInput';

export type DepositInputProps =
    React.InputHTMLAttributes<HTMLInputElement> & {
        /** Text that appears on the button present on the right side of the input; if no text
         * is provided, the button will not be rendered */
        adornmentText?: string;
        /** Handler for when the button present on the right side of the input  is
         * clicked */
        onAdornmentClick?: () => void;
        /** Changes a input's color schema */
        mode?: 'default' | 'success' | 'warning' | 'critical';
        /** Disable the input but keep the adornment button active */
        disabledFilled?: boolean;
    };

export const DepositInput = React.forwardRef<
    HTMLInputElement,
    DepositInputProps
>(
    (
        {
            mode = 'default',
            disabled = false,
            disabledFilled = false,
            adornmentText = '',
            ...props
        },
        ref
    ) => (
        <Container
            data-testid="input-wallet"
            disabled={disabled || disabledFilled}
            {...{ mode, disabledFilled }}
        >
            <StyledInput
                disabled={disabled || disabledFilled}
                {...props}
                ref={ref}
                onWheel={(e: any) => {
                    e.preventDefault();
                    (e.target as HTMLInputElement).blur();
                }}
                className='text-right px-2 bg-ui-100'
            />
            {adornmentText && (
                <ButtonText
                    label={adornmentText}
                    size="small"
                    mode="secondary"
                    bgWhite={true}
                    disabled={disabled}
                    onClick={props.onAdornmentClick}
                />
            )}
        </Container>
    )
);

DepositInput.displayName = 'WalletInputLegacy';

type StyledContainerProps = Pick<DepositInputProps, 'mode' | 'disabled'>;

export const Container = styled.div.attrs(
    ({ mode, disabled }: StyledContainerProps) => {
        let className = `${disabled ? 'border-ui-200 opacity-80' : ''
            } bg-ui-100 flex items-center space-x-1.5 p-0.75 pl-2 text-ui-600 rounded-xl 
    border-2 focus-within:ring-2 focus-within:ring-primary-500 
    hover:border-ui-300 active:border-primary-500 active:ring-0 `;

        if (mode === 'default') {
            className += 'border-ui-100';
        } else if (mode === 'success') {
            className += 'border-success-600';
        } else if (mode === 'warning') {
            className += 'border-warning-600';
        } else if (mode === 'critical') {
            className += 'border-critical-600';
        }

        return { className };
    }
) <StyledContainerProps>``;
